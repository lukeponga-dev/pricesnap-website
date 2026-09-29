# PriceSnap promotional website

A lightweight, responsive static website, adapted from the supplied HTML with the requested green and black palette. No runtime dependencies, tracking, cookies, external fonts or JavaScript. The Google Play links use the exact requested destination.

## Preview locally

From this directory run `python -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173`.

## Deploy to Vercel

Import this folder as the project root in Vercel. Choose **Other** as the framework preset, leave the build command empty, and use `.` as the output directory. Alternatively, run `vercel` from this folder, then `vercel --prod` when ready to publish. No environment variables are required. `vercel.json` includes security headers.

## Content notes

- The phone is an HTML/CSS concept preview, not an actual app screenshot. It is labelled accordingly.
- All valuation amounts, comparable listings and confidence scores are explicitly illustrative. They are not live market evidence.
- Copy reflects the requested capabilities; confirm it matches the released app before publishing.
- No unsupported accuracy, speed, guaranteed selling price, encryption, data retention or deletion promises are made.
- Privacy and deletion guidance directs visitors to the Google Play listing. Replace these with your verified privacy policy and deletion URLs when available. No legal policy has been fabricated.
- The Play listing could not be retrieved during creation, so current availability and app privacy details were not independently verified.
- Add a canonical URL after assigning your final domain. No domain is guessed.

## Files

`index.html`: all content and native, keyboard-accessible FAQ disclosures. `styles.css`: responsive layout, reduced-motion and forced-colour support. `favicon.svg`: PriceSnap favicon. `assets/`: local imagery. `vercel.json`: hosting configuration.

## Image credit
Sony Headphones by Charli Lopez, CC BY 2.0. Source: https://commons.wikimedia.org/wiki/File:Sony_Headphones_(7309383730).jpg . Resized and cropped in the phone preview; attribution is also visible in the footer.
