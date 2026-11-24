// Documents
import {siteSettings} from './documents/siteSettings'
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {service} from './documents/service'
import {certificate} from './documents/certificate'
import {clientLogo} from './documents/clientLogo'

// Objects
import {seo} from './objects/seo'
import {blockContent} from './objects/blockContent'
import {link} from './objects/link'

// Page-builder sections
import {sectionTypes} from './sections'

export const schemaTypes = [
  siteSettings,
  homePage,
  page,
  service,
  certificate,
  clientLogo,
  seo,
  blockContent,
  link,
  ...sectionTypes,
]
