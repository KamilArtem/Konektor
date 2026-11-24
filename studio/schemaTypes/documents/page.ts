import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {pageBuilderField} from '../sections'

/** Generic pages: /o-firmie, /certyfikaty, /kontakt, /polityka-prywatnosci … */
export const page = defineType({
  name: 'page',
  title: 'Podstrona',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'title', title: 'Tytuł', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    pageBuilderField,
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: `/${slug ?? ''}`}),
  },
})
