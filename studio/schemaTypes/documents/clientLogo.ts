import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Logo klienta',
  type: 'document',
  icon: UsersIcon,
  orderings: [{title: 'Kolejność', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  fields: [
    defineField({name: 'name', title: 'Nazwa', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'logo', title: 'Logo (SVG/PNG)', type: 'image', validation: (r) => r.required()}),
    defineField({name: 'url', title: 'Strona WWW', type: 'url'}),
    defineField({name: 'order', title: 'Kolejność', type: 'number', initialValue: 10}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
