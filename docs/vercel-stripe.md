# Stripe auf Vercel (`STRIPE_SECRET_KEY`)

Der **Secret Key** gehört **nur** in Umgebungsvariablen – **nie** ins Git (GitHub blockt das zu Recht).

## 1. Key in Stripe holen

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **API keys**
2. **Secret key** kopieren (`sk_test_…` oder `sk_live_…`)
3. **Nicht** den **Publishable key** (`pk_…`) verwenden

## 2. In Vercel eintragen

1. [Vercel](https://vercel.com) → dein Projekt → **Settings** → **Environment Variables**
2. **Name:** exakt `STRIPE_SECRET_KEY` (Groß/Klein wie im Code)
3. **Value:** den Secret Key einfügen, **ohne** Anführungszeichen, **keine** Leerzeichen am Anfang/Ende
4. **Environments:** mindestens **Production** aktivieren  
   - Wenn du Preview-Deployments testest: auch **Preview** setzen  
   - Optional **Development** für `vercel dev`
5. **Save** → danach **neu deployen** (siehe unten)

> Ohne Redeploy sehen laufende Deployments die neue Variable oft noch nicht.

## 3. Neu deployen (wichtig)

Nach jeder Änderung an Env-Variablen:

- **Deployments** → letztes Deployment → **⋯** → **Redeploy**  
  oder  
- neuen Commit pushen, damit ein Build startet.

## 4. Lokal testen (wie Production)

`.env.local` im Projektroot (wird von Git ignoriert):

```bash
STRIPE_SECRET_KEY=sk_test_...
```

Optional – gleiche Werte wie auf Vercel ziehen (Vercel CLI installiert):

```bash
vercel link
vercel env pull .env.local
```

## 5. Typische Fehler

| Problem | Lösung |
|--------|--------|
| `STRIPE_SECRET_KEY fehlt` | Variable in Vercel gesetzt? **Production** angehakt? **Redeploy**? |
| `Invalid API Key` | `pk_` statt `sk_`, Tippfehler im Namen, alter/widerrufener Key |
| Nur Preview kaputt | Variable auch für **Preview** anlegen |
| Lokal ok, Vercel nein | Nur in `.env.local`, nicht in Vercel → Schritt 2 |

Die API-Route `app/api/checkout/route.js` nutzt **`runtime = "nodejs"`** und **`dynamic = "force-dynamic"`**, damit der Key zur Laufzeit korrekt gelesen wird.

## 6. Customer Portal („Abo verwalten“)

1. Im Stripe-Dashboard: **Einstellungen (Zahnrad)** → **Billing** → **Customer portal** (oder **Product catalog** je nach Ansicht) – Portal **aktivieren** und gewünschte Funktionen (Kündigung, Zahlungsmittel, Rechnungen) freischalten.
2. In Supabase die Spalte **`stripe_customer_id`** anlegen: Skript **`supabase/profiles_stripe_customer_id.sql`** ausführen.
3. **`NEXT_PUBLIC_APP_URL`** in Vercel setzen (z. B. **`https://reviewpilots.com`**) – für Stripe-Redirects und Billing-Portal-Rückkehr. Ohne Variable: Fallback **`https://reviewpilots.com`** (siehe `lib/appOrigin.js`).

Die Seite **`/settings`** ruft **`POST /api/billing-portal`** auf; Stripe liefert eine **einmalige Portal-URL** (`billingPortal.sessions.create`).
