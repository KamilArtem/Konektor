# Setup Guide: Konektor (Astro + Sanity + Cloudflare + Resend)

Kompletny przewodnik konfiguracji zewnętrznych usług, zmiennych środowiskowych i wdrożenia.

---

## 1. Sanity (CMS)

### A. Utworzenie projektu
1. Zaloguj się na [sanity.io/manage](https://www.sanity.io/manage) lub utwórz nowe konto.
2. Utwórz nowy projekt (np. `konektor`).
3. Domyślny dataset: `production`.
4. Zanotuj swój **Project ID** (np. `a1b2c3d4`).

### B. Konfiguracja lokalna Studia
W pliku [studio/.env](file:///Users/kamilwejwoda/Desktop/Konektor/studio/.env) (skopiuj z [studio/.env.example](file:///Users/kamilwejwoda/Desktop/Konektor/studio/.env.example)):
```bash
SANITY_STUDIO_PROJECT_ID="TWOJ_PROJECT_ID"
SANITY_STUDIO_DATASET="production"
```
Uruchomienie studia lokalnie:
```bash
npm run dev:studio
# Otworzy http://localhost:3333
```

### C. Wdrożenie Sanity Studio na darmowy hosting Sanity
W [studio/sanity.cli.ts](file:///Users/kamilwejwoda/Desktop/Konektor/studio/sanity.cli.ts) ustawiony jest hostname `konektor` (`https://konektor.sanity.studio`).
Aby wdrożyć ręcznie:
```bash
cd studio
npx sanity login
npx sanity deploy
```
*(Uwaga: jeśli subdomena `konektor` jest zajęta, zmień `studioHost` w `studio/sanity.cli.ts` np. na `konektor-polska` lub `konektor-cms`).*

### D. CORS Origins
W panelu Sanity (`API -> CORS Origins`):
- Dodaj `http://localhost:4321` (Astro dev)
- Dodaj `https://konektor.sanity.studio` (Studio)
- Dodaj domenę produkcyjną `https://www.konektor.com.pl` (z opcją Credentials: On)

### E. Webhook do automatycznego redeployu (Sanity -> GitHub Actions)
Aby opublikowanie zmian w Sanity automatycznie przebudowało stronę:
1. W Sanity: `API -> Webhooks -> Create Webhook`.
2. URL: `https://api.github.com/repos/<TWOJ_USER>/<REPO>/dispatches`
3. Trigger on: `Create`, `Update`, `Delete`.
4. Filter: `_type in ["homePage", "page", "service", "siteSettings", "certificate", "clientLogo"]`
5. HTTP Headers:
   - `Accept: application/vnd.github.v3+json`
   - `Authorization: Bearer <GITHUB_PAT_TOKEN>` (token z uprawnieniem `repo`)
   - `User-Agent: Sanity-Webhook`
6. Payload (JSON):
   ```json
   {
     "event_type": "sanity-publish"
   }
   ```

---

## 2. Resend (E-maile)

Formularz kontaktowy wysyła maile do firmy (`bok@konektor.com.pl`) oraz auto-responder do nadawcy.

### A. Rejestracja i domena
1. Zaloguj się na [resend.com](https://resend.com).
2. Dodaj domenę: `konektor.com.pl` (lub subdomenę np. `send.konektor.com.pl` – rekomendowane, by nie kolidować z głównym MX firmy).
   - Region: **EU (Frankfurt)**.
3. Skopiuj rekordy DNS (DKIM, SPF/TXT, MX dla subdomeny) i dodaj je w panelu DNS (Cloudflare).
4. Po weryfikacji wygeneruj **API Key** (uprawnienie `Sending access`).

### B. Konfiguracja w projekcie
- Klucz produkcyjny do Cloudflare Secret:
  ```bash
  cd web
  npx wrangler secret put RESEND_API_KEY
  # wklej re_xxxxxxxxxxxx
  ```
- Do lokalnych testów w [web/.dev.vars](file:///Users/kamilwejwoda/Desktop/Konektor/web/.dev.vars):
  ```env
  RESEND_API_KEY=re_xxxxxxxxxxxx
  ```

---

## 3. Cloudflare Turnstile (Ochrona antyspamowa formularza)

Wbudowany w formularz kontaktowy jako niewidoczny / łagodny mechanizm weryfikacji człowieka (bez irytujących captchy).

1. Zaloguj się na [dash.cloudflare.com](https://dash.cloudflare.com).
2. Wybierz **Turnstile** -> **Add Site**.
3. Domena: `konektor.com.pl` oraz `localhost`.
4. Typ: **Managed** (lub Non-interactive).
5. Otrzymasz:
   - **Site Key** (klucz publiczny) -> wpisz do `web/.env`:
     ```env
     PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAA..."
     ```
   - **Secret Key** (klucz prywatny) -> wpisz do Cloudflare Secret:
     ```bash
     cd web
     npx wrangler secret put TURNSTILE_SECRET_KEY
     # oraz do web/.dev.vars do testów lokalnych
     ```

*(Dla testów lokalnych bez zakładania konta Turnstile, wartości domyślne w `.env.example` / `.dev.vars.example` to oficjalne testowe klucze Cloudflare, które zawsze przechodzą pomyślnie).*

---

## 4. Cloudflare Workers (Hosting strony)

Strona korzysta z `@astrojs/cloudflare` v14 z adapterem Worker + Static Assets.

### A. Logowanie i pierwsze wdrożenie
```bash
cd web
npx wrangler login
npm run build
npm run deploy
```
Po pierwszym wdrożeniu otrzymasz adres w domenie `konektor-web.<twoj-subdomain>.workers.dev`.

### B. Podpięcie domeny konektor.com.pl
Po dodaniu strefy `konektor.com.pl` do Cloudflare:
1. W Cloudflare Dashboard: `Workers & Pages` -> `konektor-web` -> `Settings` -> `Domains & Routes`.
2. Kliknij **Add Custom Domain** -> wpisz `www.konektor.com.pl` oraz `konektor.com.pl`.
3. Alternatywnie odkomentuj sekcję `routes` w [web/wrangler.jsonc](file:///Users/kamilwejwoda/Desktop/Konektor/web/wrangler.jsonc).

---

## 5. GitHub Actions (CI/CD)

W repozytorium przygotowane są dwa workflowy:
1. [.github/workflows/deploy-web.yml](file:///Users/kamilwejwoda/Desktop/Konektor/.github/workflows/deploy-web.yml) – wdraża stronę na Cloudflare Workers przy pushu na `main`, PR (podgląd) oraz na sygnał z Sanity.
2. [.github/workflows/deploy-studio.yml](file:///Users/kamilwejwoda/Desktop/Konektor/.github/workflows/deploy-studio.yml) – wdraża Studio po zmianach w katalogu `studio/`.

### Wymagane zmienne w GitHub (`Settings -> Secrets and variables -> Actions`):

#### Secrets:
- `CLOUDFLARE_API_TOKEN` – Token Cloudflare z uprawnieniami `Workers Scripts:Edit`, `Account Settings:Read`.
- `CLOUDFLARE_ACCOUNT_ID` – ID Twojego konta Cloudflare.
- `SANITY_DEPLOY_TOKEN` – Token z [sanity.io/manage](https://sanity.io/manage) z rolą `Deploy Studio`.

#### Variables (Non-secret):
- `SANITY_PROJECT_ID` – Twój Project ID z Sanity.
- `SANITY_DATASET` – `production`
- `PUBLIC_TURNSTILE_SITE_KEY` – Klucz publiczny Turnstile.
- `CONTACT_TO_EMAIL` – `bok@konektor.com.pl`
- `CONTACT_FROM_EMAIL` – `Konektor <formularz@konektor.com.pl>`

---

## 6. Lokalne uruchomienie projektu

1. Zainstaluj zależności w głównym katalogu:
   ```bash
   npm install
   ```
2. Skopiuj pliki środowiskowe:
   ```bash
   cp studio/.env.example studio/.env
   cp web/.env.example web/.env
   cp web/.dev.vars.example web/.dev.vars
   ```
   *(Uzupełnij `SANITY_PROJECT_ID` i `SANITY_STUDIO_PROJECT_ID` swoimi danymi z Sanity).*

3. Uruchomienie deweloperskie:
   - **Strona Astro**: `npm run dev` (będzie na `http://localhost:4321`)
   - **Sanity Studio**: `npm run dev:studio` (będzie na `http://localhost:3333`)
   - **Oba równolegle**: można uruchomić w osobnych terminalach.

4. Sprawdzenie poprawności typów i kompilacji:
   ```bash
   npm run check
   npm run build
   ```
