import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ustawienia strony',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'company', title: 'Firma', default: true},
    {name: 'form', title: 'Formularz'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'companyName', title: 'Nazwa firmy', type: 'string', group: 'company', initialValue: 'Konektor'}),
    defineField({name: 'legalName', title: 'Pełna nazwa (stopka / RODO)', type: 'string', group: 'company'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', group: 'company'}),
    defineField({name: 'phone', title: 'Telefon', type: 'string', group: 'company', initialValue: '+48 781 262 626'}),
    defineField({name: 'email', title: 'E-mail', type: 'string', group: 'company', initialValue: 'bok@konektor.com.pl'}),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'object',
      group: 'company',
      fields: [
        defineField({name: 'street', title: 'Ulica', type: 'string', initialValue: 'ul. Gen. Ottokara Brzozy-Brzeziny 22'}),
        defineField({name: 'postalCode', title: 'Kod pocztowy', type: 'string', initialValue: '05-220'}),
        defineField({name: 'city', title: 'Miasto', type: 'string', initialValue: 'Zielonka'}),
        defineField({name: 'mapUrl', title: 'Link do mapy', type: 'url'}),
      ],
    }),
    defineField({name: 'nip', title: 'NIP', type: 'string', group: 'company'}),
    defineField({name: 'footerTagline', title: 'Hasło w stopce', type: 'text', rows: 2, group: 'company'}),
    defineField({
      name: 'formRecipients',
      title: 'Odbiorcy zgłoszeń z formularza',
      description: 'Adresy, na które trafiają wiadomości z formularza kontaktowego.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'form',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Komunikat po wysłaniu',
      type: 'string',
      group: 'form',
      initialValue: 'Dziękujemy! Odpowiemy najszybciej jak to możliwe.',
    }),
    defineField({name: 'seo', title: 'Domyślne SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Ustawienia strony'})},
})
