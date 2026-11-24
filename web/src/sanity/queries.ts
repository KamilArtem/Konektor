/**
 * All GROQ queries live here (plain .ts) so `npm run typegen` can generate
 * result types into src/sanity/sanity.types.ts.
 */
import {defineQuery} from 'groq'

const linkProjection = /* groq */ `
  ...,
  "href": select(
    type == "external" => href,
    internal->_type == "homePage" => "/",
    internal->_type == "service" => "/serwisy/" + internal->slug.current,
    "/" + internal->slug.current
  )
`

const sectionsProjection = /* groq */ `
  sections[]{
    ...,
    _type,
    _key,
    links[]{ ${linkProjection} },
    _type == "heroSection" => {
      "videoUrl": video.asset->url
    },
    _type == "servicesSection" => {
      "services": *[_type == "service" && defined(slug.current)] | order(order asc){
        _id, title, shortTitle, excerpt, icon, "image": hero.image, "slug": slug.current
      }
    },
    _type == "logosSection" => {
      "logos": *[_type == "clientLogo"] | order(order asc){ _id, name, logo, url }
    },
    _type == "certificatesSection" => {
      "certificates": *[_type == "certificate"] | order(order asc){
        _id, title, issuer, issuedAt, image, "fileUrl": file.asset->url
      }
    }
  }
`

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]`)

export const NAVIGATION_QUERY = defineQuery(`{
  "services": *[_type == "service" && defined(slug.current)] | order(order asc){
    title, shortTitle, "slug": slug.current, showInContactForm
  }
}`)

export const HOME_QUERY = defineQuery(`*[_id == "homePage"][0]{
  ...,
  ${sectionsProjection}
}`)

export const PAGE_SLUGS_QUERY = defineQuery(`*[_type == "page" && defined(slug.current)].slug.current`)

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  ...,
  ${sectionsProjection}
}`)

export const SERVICE_SLUGS_QUERY = defineQuery(`*[_type == "service" && defined(slug.current)].slug.current`)

export const SERVICE_QUERY = defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  ...,
  ${sectionsProjection}
}`)

export const FORM_CONFIG_QUERY = defineQuery(`*[_id == "siteSettings"][0]{ formRecipients, companyName }`)
