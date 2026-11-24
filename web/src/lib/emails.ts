/**
 * Plain HTML email templates (no extra deps). Can be swapped for React Email later.
 */
type ContactInput = {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}

const esc = (s = '') =>
  s.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)

const row = (label: string, value?: string) =>
  value
    ? `<tr><td style="padding:6px 12px;color:#666;vertical-align:top">${label}</td><td style="padding:6px 12px">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
    : ''

export function contactEmail(d: ContactInput) {
  const subject = `Nowe zapytanie ze strony${d.service ? ` – ${d.service}` : ''} (${d.name})`
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="margin:0 0 16px">Nowe zapytanie z formularza kontaktowego</h2>
<table style="border-collapse:collapse">
${row('Imię i nazwisko', d.name)}
${row('E-mail', d.email)}
${row('Telefon', d.phone)}
${row('Firma', d.company)}
${row('Usługa', d.service)}
${row('Wiadomość', d.message)}
</table>
<p style="color:#888;font-size:12px;margin-top:24px">Odpowiedz bezpośrednio na tę wiadomość, aby napisać do klienta.</p>
</body></html>`
  const text = [
    'Nowe zapytanie z formularza kontaktowego',
    `Imię i nazwisko: ${d.name}`,
    `E-mail: ${d.email}`,
    d.phone && `Telefon: ${d.phone}`,
    d.company && `Firma: ${d.company}`,
    d.service && `Usługa: ${d.service}`,
    '',
    d.message,
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n')
  return {subject, html, text}
}

export function confirmationEmail(d: ContactInput) {
  const subject = 'Otrzymaliśmy Twoją wiadomość – Konektor'
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<p>Dzień dobry ${esc(d.name)},</p>
<p>dziękujemy za kontakt. Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to możliwe.</p>
<p>W pilnych sprawach zadzwoń: <a href="tel:+48781262626">+48 781 262 626</a></p>
<p>Pozdrawiamy,<br>Zespół Konektor</p>
</body></html>`
  const text = `Dzień dobry ${d.name},\n\ndziękujemy za kontakt. Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to możliwe.\nW pilnych sprawach zadzwoń: +48 781 262 626\n\nPozdrawiamy,\nZespół Konektor`
  return {subject, html, text}
}
