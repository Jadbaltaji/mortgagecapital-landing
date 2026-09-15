# Mortgage Capital LLC — website

Static site: no build step, no dependencies. Four pages plus a stylesheet, a script, and the logo.

```
index.html     Home (loan options, process, about, contact)
quote.html     Quote request form with TCPA/SMS consent capture
terms.html     Terms & Conditions (includes SMS program terms)
privacy.html   Privacy Policy (includes SMS no-sharing statement)
styles.css     All styling — brand colors are the first lines under :root
main.js        Mobile nav + form handling / lead webhook
assets/        Logo
```

## Host on GitHub Pages

1. Create a new repository (e.g. `mortgage-capital-site`) and push these files to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. The site is live at `https://<your-username>.github.io/<repo>/` within a minute or two.
4. Custom domain (mymtgcapital.com): under **Settings → Pages → Custom domain** enter the domain, then at your DNS provider add
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<your-username>.github.io`
   
   Tick **Enforce HTTPS** once the certificate is issued. The `CNAME` file in this repo is pre-filled with `www.mymtgcapital.com`; change it if you use a different domain.

## Before going live

- **Lead delivery:** open `main.js` and set `LEAD_WEBHOOK_URL` to your CRM / Zapier / Make endpoint. Until it's set, submissions log to the browser console and show the success screen (good for testing).
- **Licensing line:** the footer in every page lists NMLS #2320968 and the Michigan DIFS license. Add any other state licenses exactly as they appear on NMLS Consumer Access.
- **Hero image (optional):** drop a photo at `assets/hero.jpg` and add `background:url(assets/hero.jpg) center/cover` to the `.hero` rule in `styles.css`.

## Texting campaign (10DLC) registration

The campaign vetting form will ask for:
- Public URL of the opt-in page → `https://www.mymtgcapital.com/quote.html`
- Screenshot of the consent checkbox and language (unchecked by default)
- Privacy policy URL → `privacy.html` (contains the "mobile information will not be shared with third parties" statement)
- Terms URL → `terms.html` (contains program description, STOP/HELP, frequency, rates)
- Sample messages — e.g. `Mortgage Capital: Hi {name}, thanks for your quote request. When is a good time to talk about your options? Reply STOP to opt out.`

Every submission stores the consent text, a `consent_version`, timestamp, page URL, and user agent so you can produce proof of consent on request.
