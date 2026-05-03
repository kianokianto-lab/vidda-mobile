# VIDDA WEAR — Mobile App (Phase 3)

Expo (iOS + Android) companion to **vidda-web** (Phase 2).

## Stack

- Expo SDK 54 · React Native 0.81 · React 19 · TypeScript 5
- **Expo Router** — file-based routing (`app/`)
- **Zustand + AsyncStorage** — cart store (mirrors vidda-web shape)
- **expo-secure-store** — customer auth tokens
- **expo-notifications** — push (relayed via Expo's APNs/FCM bridge — no Apple/Google direct creds needed for preview builds)
- **expo-linking** + universal links — deep-linking (`vidda://` scheme + `https://viddawear.store/*` associated domain on iOS, intent filters on Android)

## Project layout

```
app/
  _layout.tsx               root stack + token hydration + push registration
  (tabs)/
    _layout.tsx             bottom tabs (Home / Shop / Cart / Account)
    index.tsx               hero + Summer '26 promo
    shop.tsx                PLP — flat list of products
    cart.tsx                cart drawer
    account.tsx             profile / sign out
  product/[slug].tsx        PDP — variant selectors, qty, add to cart
  checkout.tsx              full checkout (COD + WhatsApp)
  auth/login.tsx            sign in
  auth/signup.tsx           sign up
lib/
  tokens.ts                 design tokens (sync with web)
  api.ts                    API client → vidda-web
  cart.ts                   cart store
  auth.ts                   customer auth (local-first)
  push.ts                   Expo push registration
```

## Run locally

```bash
pnpm install
pnpm start             # Expo dev server, scan QR with Expo Go
pnpm ios               # iOS simulator
pnpm android           # Android emulator
```

## Configure

Copy `app.json` → adjust `extra.apiBaseUrl` if your web backend lives somewhere else.

In `eas.json`, the `preview` and `production` profiles set `EXPO_PUBLIC_API_BASE_URL`. When the production domain cuts over from `viddawear.store` to a Next.js host, change it there.

## EAS builds

Prereqs (one-time):

```bash
npm install -g eas-cli
eas login
eas init --id <create new project on expo.dev>   # writes the projectId to app.json
```

Then:

```bash
pnpm build:preview:android      # → installable APK (no Google Play needed)
pnpm build:preview:ios          # → ad-hoc IPA (needs Apple Developer account)
pnpm build:production:android   # → AAB for Play Store
pnpm build:production:ios       # → IPA for App Store
```

`eas.json` has placeholders for App Store Connect IDs and a Play Console
service account JSON path. Production submission needs:

- **Apple:** `appleId`, `ascAppId`, `appleTeamId` ($99/yr Developer Program)
- **Google:** `play-service-account.json` ($25 one-time Play Console fee + service account key)

These are the only items that block publishing. Production builds themselves
are fully automatable once those credentials exist.

## Push notifications

`lib/push.ts` registers the device via `Notifications.getExpoPushTokenAsync`
on app boot and POSTs the token to `${apiBaseUrl}/api/push/register` (best
effort — the endpoint will be added on the web side as a small follow-up).
Works on physical devices; simulators silently no-op.

## Deep linking

- iOS: `applinks:viddawear.store` in `app.json` → universal links open the app for `https://viddawear.store/*`.
- Android: `intentFilters` for `https://viddawear.store/*`, autoVerify on.
- Custom scheme: `vidda://product/<slug>` opens the PDP directly.

## Auth

Customer auth is implemented locally in `lib/auth.ts`: signup/signin persist
a profile + opaque token to expo-secure-store. This is intentional — the web
side does not yet expose `/api/auth/{login,signup,me}` and we wanted the app
to be testable end-to-end without that API. When the web auth endpoints
land, swap the placeholder fetches in `signin` / `signup`.

## Sync with vidda-web

`lib/tokens.ts` is hand-mirrored from `tailwind.config.ts` in vidda-web.
Cart/order shape in `lib/cart.ts` and the checkout payload in
`app/checkout.tsx` match exactly the `/api/orders` contract on vidda-web.
