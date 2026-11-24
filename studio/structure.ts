import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {WrenchIcon} from '@sanity/icons/Wrench'
import {StarIcon} from '@sanity/icons/Star'
import {UsersIcon} from '@sanity/icons/Users'

export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Treści')
    .items([
      S.listItem()
        .title('Strona główna')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('service').title('Usługi').icon(WrenchIcon),
      S.documentTypeListItem('page').title('Podstrony').icon(DocumentsIcon),
      S.documentTypeListItem('certificate').title('Certyfikaty').icon(StarIcon),
      S.documentTypeListItem('clientLogo').title('Zaufali nam (logotypy)').icon(UsersIcon),
      S.divider(),
      S.listItem()
        .title('Ustawienia strony')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
