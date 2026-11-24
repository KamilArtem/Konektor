import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {pageBuilderField} from '../sections'

export const homePage = defineType({
  name: 'homePage',
  title: 'Strona główna',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({name: 'title', title: 'Tytuł (wewnętrzny)', type: 'string', initialValue: 'Strona główna'}),
    pageBuilderField,
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Strona główna'})},
})
