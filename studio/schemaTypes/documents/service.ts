import {defineArrayMember, defineField, defineType} from 'sanity'
import {WrenchIcon} from '@sanity/icons/Wrench'
import {pageBuilderField} from '../sections'

/** Offer pages: /serwisy/[slug] (SSP, DSO, SSWiN, SKD, CCTV, gaśnice i hydranty) */
export const service = defineType({
  name: 'service',
  title: 'Usługa',
  type: 'document',
  icon: WrenchIcon,
  orderings: [{title: 'Kolejność', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  groups: [
    {name: 'main', title: 'Podstawowe', default: true},
    {name: 'content', title: 'Treść'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Nazwa usługi', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({
      name: 'shortTitle',
      title: 'Krótka nazwa (menu)',
      description: 'np. „SSP”, „Monitoring wizyjny”',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      options: {source: 'title'},
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Kolejność', type: 'number', group: 'main', initialValue: 10}),
    defineField({name: 'icon', title: 'Ikona', type: 'image', group: 'main'}),
    defineField({name: 'excerpt', title: 'Krótki opis (karty / menu)', type: 'text', rows: 3, group: 'main'}),
    defineField({
      name: 'showInContactForm',
      title: 'Pokaż w formularzu kontaktowym',
      type: 'boolean',
      initialValue: true,
      group: 'main',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'heading', title: 'Nagłówek', type: 'string'}),
        defineField({name: 'highlight', title: 'Wyróżnienie (2. linia)', type: 'string'}),
        defineField({name: 'intro', title: 'Wstęp', type: 'text', rows: 4}),
        defineField({name: 'image', title: 'Zdjęcie', type: 'image', options: {hotspot: true}}),
      ],
    }),
    defineField({
      name: 'benefits',
      title: 'Zalety (3 kolumny)',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'benefit',
          fields: [
            defineField({name: 'title', title: 'Tytuł', type: 'string'}),
            defineField({name: 'text', title: 'Opis', type: 'text', rows: 3}),
            defineField({name: 'icon', title: 'Ikona', type: 'image'}),
          ],
        }),
      ],
    }),
    {...pageBuilderField, group: 'content'},
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', media: 'icon'},
    prepare: ({title, slug, media}) => ({title, subtitle: `/serwisy/${slug ?? ''}`, media}),
  },
})
