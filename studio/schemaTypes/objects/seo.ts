import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      validation: (r) => r.max(60).warning('Najlepiej do 60 znaków'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(160).warning('Najlepiej do 160 znaków'),
    }),
    defineField({name: 'ogImage', title: 'Obraz OG (1200×630)', type: 'image'}),
    defineField({name: 'noIndex', title: 'Ukryj przed wyszukiwarkami', type: 'boolean', initialValue: false}),
  ],
})
