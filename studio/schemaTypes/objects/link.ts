import {defineField, defineType} from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Link / przycisk',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Tekst', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Strona wewnętrzna', value: 'internal'},
          {title: 'Adres URL', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internal',
      title: 'Strona',
      type: 'reference',
      to: [{type: 'page'}, {type: 'service'}, {type: 'homePage'}],
      hidden: ({parent}) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'URL (https://, mailto:, tel:, #kotwica)',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'external',
    }),
  ],
})
