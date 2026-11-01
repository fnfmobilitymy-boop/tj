# Scrolling and mobile layout review

- Floating controls cache document geometry, pass gestures through their empty gap, and guard repeated smooth-scroll calls.
- The quote panel stops intercepting pointers immediately when dismissed. Mobile date/day controls have equal dimensions, constrained grid tracks and 16px text to avoid iOS focus zoom.
- Decorative Skip and animation pause controls are hidden; reduced-motion preferences still apply.
- Offscreen particle rendering stops. Visible particle drawing batches paths and uses fewer particles on mobile.
- The 130-model catalogue renders 12 cards per page; search and filters still cover all models. Car illustrations load individual WebP thumbnails (about 2 MB total), rather than entire PNG sheets.
- Destination images use WebP. Maps load only after an explicit action. Service pages omit the unused fleet data bundle.

Validation: syntax/build checks; all 130 models reachable through pagination; search, capacity filters, booking, three languages, 12 responsive combinations, touch scrolling through the control gap, back-to-top, quote dismissal/reopening, and map loading.

One local Chromium run at 390×844 with 4× CPU throttling, scrolling at the footer for about 2.4 seconds: offscreen Canvas fills fell from 75,650 to 0; script time from 641 ms to 154 ms; mounted cards from 130 to 12. These are lab measurements, not guarantees for every phone or network. Mobile quote screenshots were inspected in Chromium; physical iPhone Safari was not available.
