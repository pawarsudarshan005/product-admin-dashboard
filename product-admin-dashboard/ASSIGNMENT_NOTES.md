# Assignment Notes

## Choices made

- **One shared Axios instance** (`lib/api.ts`) — a request interceptor attaches the
  token, a response interceptor turns every error into a plain `Error` with a readable
  message (and logs out on a 401), so no component needs its own try/catch boilerplate
  for auth headers or error shapes.
- **URL as the source of truth** for page/pageSize/search/category/sort/order
  (`utils/urlParams.ts`) instead of component state, so refreshing or sharing a link
  reproduces the same view.
- **Manual pagination and sorting** — no table/pagination library; page numbers are
  windowed by hand, and sorting is passed straight through to DummyJSON's `sortBy`/
  `order` params.
- **Debounced search with request cancellation** — a 500ms debounce plus an
  `AbortController` per request so slow, stale responses can't overwrite newer ones.
- **A client-side overlay for create/update/delete** (`lib/localProducts.ts`) since
  DummyJSON doesn't persist writes.
- **Responsive table/cards** — one `ProductTable` for desktop, one `ProductCard` for
  mobile, switched with Tailwind's `md:` breakpoint rather than a JS media query.
- **API calls live in `services/`**, never inside a component — components only call
  `getProducts()`, `createProduct()`, etc.

## Problem faced

Handling stale search responses: DummyJSON's `/products/search` is easy to over-fetch
from — every keystroke is a new request, and with `&delay=2000` a fast typist could see
an old query's results flash in after a newer one already rendered.

## Solution

1. Debounce the search input 500ms before it touches the URL/API at all, so most
   keystrokes never fire a request.
2. Each fetch effect run creates a fresh `AbortController` and calls `.abort()` on the
   previous one when the effect re-runs or unmounts, cancelling the actual HTTP request.
3. An `isCurrent` flag is also set to `false` in that same cleanup, as a second guard —
   in the rare case a response resolves in the brief window between the abort call and
   the browser actually dropping the connection, the state update is still skipped.

Tested by appending `&delay=2000` to the DummyJSON calls in `productService.ts` and
typing a query quickly (e.g. "phone" → "iphone" → "iphone case"): only the last query's
result ever renders.

## AI usage

AI (Claude) was used throughout — for scaffolding the project structure, writing the
Axios/service layer, the URL-state parsing, the debounce/cancellation logic, and the UI
components — based on the assignment's requirements. Every file was reviewed and
understood afterward, particularly the request-cancellation logic, the auth flow, and the
local CRUD overlay, since those are the parts most likely to come up in a live
walkthrough or a small live change.
