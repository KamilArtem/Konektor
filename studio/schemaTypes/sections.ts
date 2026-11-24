import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page-builder sections. Each maps 1:1 to an Astro component in
 * web/src/components/sections/<Name>.astro (see SectionRenderer.astro).
 * UI will be designed later – fields reflect the current konektor.com.pl content.
 */

const heading = defineField({name: 'heading', title: 'Nagłówek', type: 'string'})
const eyebrow = defineField({name: 'eyebrow', title: 'Nadtytuł', type: 'string'})
const text = defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3})
const links = defineField({name: 'links', title: 'Przyciski', type: 'array', of: [{type: 'link'}]})

const preview = (fallback: string) => ({
  select: {title: 'heading'},
  prepare: ({title}: {title?: string}) => ({title: title || fallback, subtitle: fallback}),
})

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    eyebrow,
    heading,
    text,
    links,
    defineField({name: 'image', title: 'Obraz / Poster wideo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'video', title: 'Wideo w tle (MP4 / WebM)', type: 'file', options: {accept: 'video/mp4,video/webm'}}),
  ],
  preview: preview('Hero'),
})

export const featuresSection = defineType({
  name: 'featuresSection',
  title: 'Kafelki / cechy',
  type: 'object',
  fields: [
    eyebrow,
    heading,
    text,
    defineField({
      name: 'items',
      title: 'Elementy',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'string'}),
            defineField({name: 'text', title: 'Opis', type: 'text', rows: 3}),
            defineField({name: 'icon', title: 'Ikona', type: 'image'}),
          ],
        }),
      ],
    }),
  ],
  preview: preview('Kafelki'),
})

export const textImageSection = defineType({
  name: 'textImageSection',
  title: 'Tekst + obraz',
  type: 'object',
  fields: [
    eyebrow,
    heading,
    defineField({name: 'body', title: 'Treść', type: 'blockContent'}),
    defineField({name: 'image', title: 'Obraz', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'imagePosition',
      title: 'Pozycja obrazu',
      type: 'string',
      options: {list: ['left', 'right'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'right',
    }),
    links,
  ],
  preview: preview('Tekst + obraz'),
})

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Lista usług',
  type: 'object',
  description: 'Automatycznie wyświetla wszystkie usługi',
  fields: [eyebrow, heading, text],
  preview: preview('Lista usług'),
})

export const statsSection = defineType({
  name: 'statsSection',
  title: 'Liczby / statystyki',
  type: 'object',
  fields: [
    eyebrow,
    heading,
    text,
    defineField({
      name: 'items',
      title: 'Statystyki',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'value', title: 'Wartość', type: 'number'}),
            defineField({name: 'prefix', title: 'Prefiks', type: 'string', initialValue: '+'}),
            defineField({name: 'suffix', title: 'Sufiks', type: 'string'}),
            defineField({name: 'label', title: 'Opis', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
  ],
  preview: preview('Statystyki'),
})

export const timelineSection = defineType({
  name: 'timelineSection',
  title: 'Historia (oś czasu)',
  type: 'object',
  fields: [
    eyebrow,
    heading,
    text,
    defineField({
      name: 'items',
      title: 'Wydarzenia',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'milestone',
          fields: [
            defineField({name: 'date', title: 'Okres / rok', type: 'string'}),
            defineField({name: 'title', title: 'Tytuł', type: 'string'}),
            defineField({name: 'text', title: 'Opis', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'date'}},
        }),
      ],
    }),
  ],
  preview: preview('Oś czasu'),
})

export const logosSection = defineType({
  name: 'logosSection',
  title: 'Zaufali nam (tekst + logotypy)',
  type: 'object',
  description: 'Wyświetla dokumenty „Logo klienta” oraz tekst wprowadzający',
  fields: [eyebrow, text, heading],
  preview: preview('Zaufali nam'),
})

export const certificatesSection = defineType({
  name: 'certificatesSection',
  title: 'Certyfikaty',
  type: 'object',
  description: 'Wyświetla dokumenty „Certyfikat”',
  fields: [eyebrow, heading, text],
  preview: preview('Certyfikaty'),
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    heading,
    defineField({
      name: 'items',
      title: 'Pytania',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', title: 'Pytanie', type: 'string'}),
            defineField({name: 'answer', title: 'Odpowiedź', type: 'blockContent'}),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
    }),
  ],
  preview: preview('FAQ'),
})

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Formularz kontaktowy',
  type: 'object',
  description: 'Dane kontaktowe z „Ustawień strony” + formularz (Resend)',
  fields: [eyebrow, heading, text],
  preview: preview('Formularz kontaktowy'),
})

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Wezwanie do działania (CTA)',
  type: 'object',
  fields: [heading, text, links],
  preview: preview('CTA'),
})

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Tekst (np. polityka prywatności)',
  type: 'object',
  fields: [heading, defineField({name: 'body', title: 'Treść', type: 'blockContent'})],
  preview: preview('Tekst'),
})

export const sectionTypes = [
  heroSection,
  featuresSection,
  textImageSection,
  servicesSection,
  statsSection,
  timelineSection,
  logosSection,
  certificatesSection,
  faqSection,
  contactSection,
  ctaSection,
  richTextSection,
]

export const pageBuilderField = defineField({
  name: 'sections',
  title: 'Sekcje',
  type: 'array',
  of: sectionTypes.map((t) => defineArrayMember({type: t.name})),
  options: {
    insertMenu: {views: [{name: 'list'}]},
  },
})
