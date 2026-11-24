import {defineAction, ActionError} from 'astro:actions'
import {z} from 'astro/zod'
import {Resend} from 'resend'
import {
  RESEND_API_KEY,
  TURNSTILE_SECRET_KEY,
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
} from 'astro:env/server'
import {sanityFetch} from '@/sanity/client'
import {FORM_CONFIG_QUERY} from '@/sanity/queries'
import {contactEmail, confirmationEmail} from '@/lib/emails'

async function verifyTurnstile(token: string | undefined, ip: string | undefined) {
  if (!TURNSTILE_SECRET_KEY) return true // not configured (local dev)
  if (!token) return false
  const body = new FormData()
  body.append('secret', TURNSTILE_SECRET_KEY)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method: 'POST', body})
  const data = (await res.json()) as {success: boolean}
  return data.success
}

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(2, 'Podaj imię i nazwisko').max(120),
      email: z.email('Podaj poprawny adres e-mail'),
      phone: z.string().trim().max(40).optional(),
      company: z.string().trim().max(160).optional(),
      service: z.string().trim().max(160).optional(),
      message: z.string().trim().min(10, 'Wiadomość jest za krótka').max(5000),
      consent: z.literal('on', {message: 'Wymagana zgoda na przetwarzanie danych'}),
      // Honeypot – must stay empty
      website: z.string().max(0).optional(),
      'cf-turnstile-response': z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input.website) return {ok: true} // silently drop bots

      const ip = context.request.headers.get('cf-connecting-ip') ?? undefined
      if (!(await verifyTurnstile(input['cf-turnstile-response'], ip))) {
        throw new ActionError({code: 'FORBIDDEN', message: 'Weryfikacja antyspamowa nie powiodła się.'})
      }

      if (!RESEND_API_KEY) {
        console.error('[contact] RESEND_API_KEY missing')
        throw new ActionError({code: 'INTERNAL_SERVER_ERROR', message: 'Formularz jest chwilowo niedostępny.'})
      }

      const settings = await sanityFetch<{formRecipients?: string[]} | null>(FORM_CONFIG_QUERY, {}, null).catch(
        () => null,
      )
      const to = settings?.formRecipients?.length ? settings.formRecipients : [CONTACT_TO_EMAIL]

      const resend = new Resend(RESEND_API_KEY)
      const notification = contactEmail(input)

      const {error} = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to,
        replyTo: input.email,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
      })

      if (error) {
        console.error('[contact] Resend error', error)
        throw new ActionError({code: 'INTERNAL_SERVER_ERROR', message: 'Nie udało się wysłać wiadomości.'})
      }

      // Auto-reply to the sender (non-blocking for the result)
      const confirmation = confirmationEmail(input)
      await resend.emails
        .send({
          from: CONTACT_FROM_EMAIL,
          to: input.email,
          replyTo: to[0],
          subject: confirmation.subject,
          html: confirmation.html,
          text: confirmation.text,
        })
        .catch((e) => console.error('[contact] confirmation failed', e))

      return {ok: true}
    },
  }),
}
