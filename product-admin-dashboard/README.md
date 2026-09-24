# Product Admin Dashboard

A small admin dashboard for logging in and managing products, built against the free
[DummyJSON](https://dummyjson.com) API for a frontend interview assignment.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Axios (one shared instance, all API calls go through it)
- No React Query / SWR / table or pagination libraries — pagination, search, filtering,
  sorting and URL syncing are all hand-written

## Features completed

- **Login** — `emilys` / `emilyspass` against `POST /auth/login`, field validation, an
  API error message on wrong credentials, a disabled submit button while the request is
  in flight (no duplicate logins), token stored client-side, logout clears it.
- **Protected routes** — everything under `/products` redirects to `/login` if there is
  no token.
- **Product list** — table on desktop, cards on mobile. Image, title, category, price,
  rating, stock, and view/edit/delete actions.
- **Pagination** — page numbers, Previous/Next, a 10/20/50 page-size selector, and a
  "Showing X–Y of Z" label. All hand-written against the API's `limit`/`skip`.
- **Search** — debounced (500ms), resets to page 1, and cancels in-flight requests with
  `AbortController` so a slow older response can never overwrite a newer one.
- **Category filter + sorting** — categories from `/products/categories`; sorting by
  title/price/rating (ascending/descending) via the API's `sortBy`/`order` params.
- **Product details** (`/products/[id]`) — images, description, price, stock, reviews;
  a "Product Not Found" page for a bad or missing id.
- **Add / Edit / Delete** — a shared validated form for create and edit, and a confirm
  dialog before delete. See "DummyJSON write limitation" below for how these are made to
  stick in the UI.
- **Loading / empty / error states** — every data screen has a loader, an empty-state
  message, and a Retry button on failure.
- **URL state** — `page`, `pageSize`, `search`, `category`, `sort`, `order` all live in
  the URL, so refreshing or sharing a link reproduces the same view. Invalid values
  (`?page=abc`, `?page=999`, `?pageSize=999999`) are normalized instead of crashing.
- **Dashboard shell** — a sidebar and topbar that stay fixed, with the page header and
  filters sticky at the top of the content area, so only the product records scroll.

## Folder structure

```
app/
  login/page.tsx                Login page
  products/
    layout.tsx                  Sidebar + topbar shell, wraps ProtectedRoute
    page.tsx                    Product list (Suspense wrapper)
    new/page.tsx                Add product
    [id]/page.tsx                Product detail
    [id]/edit/page.tsx           Edit product
  layout.tsx, page.tsx, not-found.tsx, globals.css

components/
  auth/LoginForm.tsx
  common/                      Loader, ErrorMessage, EmptyState, Banner,
                               ConfirmDialog, ProtectedRoute
  products/                    Sidebar, ProductTable, ProductCard, ProductFilters,
                               ProductPagination, ProductForm, ProductNotFound,
                               ProductsPageContent (the list page's logic)

services/
  authService.ts               loginUser()
  productService.ts            getProducts, searchProducts, getProductsByCategory,
                               getCategories, getProductById, createProduct,
                               updateProduct, deleteProduct

lib/
  api.ts                       shared Axios instance + interceptors
  auth.ts                      token/user storage (localStorage)
  localProducts.ts             client-side overlay for create/update/delete
  flashMessage.ts              one-shot success message across a redirect

hooks/useDebounce.ts
types/auth.ts, product.ts
utils/urlParams.ts             parses/normalizes/builds the URL query state
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with:

- Username: `emilys`
- Password: `emilyspass`

Production build:

```bash
npm run build
npm start
```

No environment variables are required — the DummyJSON base URL is hardcoded in
`lib/api.ts` since it's a fixed public API for this assignment.

## Implementation notes

### Search race conditions

The search effect in `ProductsPageContent` creates an `AbortController` per request and
also tracks an `isCurrent` flag. When the URL's search/filter/sort/page state changes
again before a request resolves, the effect's cleanup aborts the in-flight request *and*
flips `isCurrent` to false, so even if a response slips through right as cleanup runs, it
is ignored. Verified with `&delay=2000` appended to the DummyJSON calls — typing "phone"
then quickly "iphone" only ever shows the "iphone" result.

### Search vs. category filter

DummyJSON can't search and filter by category in the same request. This app makes
**search take priority**: the category `<select>` is disabled (with a note) while there
is an active search term, and the fetch logic only calls `/products/category/...` when
search is empty.

### DummyJSON write limitation

`POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id` all respond with a
success payload but don't actually persist anything — a following `GET` returns the old
data, and every "created" product comes back with the same id (195). To make Add/Edit/
Delete feel real, `lib/localProducts.ts` keeps a small localStorage-backed overlay of
created/updated/deleted products, and the product list/detail pages apply it on top of
whatever the API returns. Created products get a client-generated unique id
(`Date.now()`) instead of the API's reused one.

### Invalid URL parameters

`utils/urlParams.ts` is the one place that parses the query string. Anything that isn't a
positive integer page, isn't one of the three page sizes, or isn't a known sort field
falls back to a default — `?page=abc`, `?page=999`, `?pageSize=999999` all just render
normally instead of crashing (page 999 simply shows an empty result with a way back to
page 1).

### Duplicate submissions

Login, Save (create/edit) and Delete all guard against double-firing: an `isSubmitting` /
`isDeleting` flag is checked at the top of the handler *and* used to disable the button,
so rapid clicks only ever trigger one request.

### Sorting

Sorting is server-side — DummyJSON accepts `sortBy`/`order` on `/products`,
`/products/search`, and `/products/category/:name` alike, so the same query params work
regardless of which of the three endpoints is active.

## AI usage

This project was built with AI assistance (Claude). AI was used to scaffold the file
structure, write the Axios/service layer, the URL-state and race-condition handling, and
the UI components, based on this assignment's requirements. Every file was reviewed
afterward; the "Implementation notes" above describe the reasoning behind the trickier
parts (race conditions, the search/category conflict, and the non-persistent CRUD) so
they can be walked through and modified live.

## Future improvements

- Real reviews CRUD (DummyJSON doesn't expose a reviews-write endpoint)
- Optimistic UI updates while a create/update/delete request is in flight, with rollback
  on failure
- Toast notifications instead of an inline dismissible banner
