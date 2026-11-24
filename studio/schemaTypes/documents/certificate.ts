import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

export const certificate = defineType({
  name: 'certificate',
  title: 'Certyfikat',
  type: 'document',
  icon: StarIcon,
  orderings: [{title: 'Kolejność', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  fields: [
    defineField({name: 'title', title: 'Nazwa', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'issuer', title: 'Wystawca', type: 'string'}),
    defineField({name: 'issuedAt', title: 'Data wydania', type: 'date'}),
    defineField({name: 'image', title: 'Skan / miniatura', type: 'image', options: {hotspot: true}}),
    defineField({name: 'file', title: 'Plik PDF', type: 'file', options: {accept: 'application/pdf'}}),
    defineField({name: 'order', title: 'Kolejność', type: 'number', initialValue: 10}),
  ],
  preview: {select: {title: 'title', subtitle: 'issuer', media: 'image'}},
})
