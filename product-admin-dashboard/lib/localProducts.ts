import type { Product } from "@/types/product";

// DummyJSON's add/update/delete endpoints respond with a success payload
// but never actually persist the change - a second GET still returns the
// old data. To make Add/Edit/Delete feel real in the UI, we keep a small
// "overlay" of local changes in localStorage and apply it on top of
// whatever the API returns.
const STORAGE_KEY = "pad_local_products";

interface LocalOverlay {
  created: Product[];
  updated: Record<number, Product>;
  deletedIds: number[];
}

function emptyOverlay(): LocalOverlay {
  return { created: [], updated: {}, deletedIds: [] };
}

function readOverlay(): LocalOverlay {
  if (typeof window === "undefined") return emptyOverlay();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyOverlay();
  try {
    return JSON.parse(raw) as LocalOverlay;
  } catch {
    return emptyOverlay();
  }
}

function writeOverlay(overlay: LocalOverlay): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
}

/** Products created in this session (not returned by the API's own list). */
export function getLocallyCreatedProducts(): Product[] {
  return readOverlay().created;
}

export function saveCreatedProduct(product: Product): void {
  const overlay = readOverlay();
  overlay.created = [product, ...overlay.created];
  writeOverlay(overlay);
}

export function saveUpdatedProduct(product: Product): void {
  const overlay = readOverlay();
  const createdIndex = overlay.created.findIndex((p) => p.id === product.id);
  if (createdIndex !== -1) {
    // Editing a product that only exists locally - update it in place.
    overlay.created[createdIndex] = product;
  } else {
    overlay.updated[product.id] = product;
  }
  writeOverlay(overlay);
}

export function saveDeletedProductId(id: number): void {
  const overlay = readOverlay();
  overlay.created = overlay.created.filter((p) => p.id !== id);
  delete overlay.updated[id];
  if (!overlay.deletedIds.includes(id)) {
    overlay.deletedIds.push(id);
  }
  writeOverlay(overlay);
}

/** A locally created or edited version of a single product, if one exists. */
export function getLocalProduct(id: number): Product | undefined {
  const overlay = readOverlay();
  return overlay.created.find((p) => p.id === id) ?? overlay.updated[id];
}

export function isLocallyDeleted(id: number): boolean {
  return readOverlay().deletedIds.includes(id);
}

/** Applies local edits/deletes on top of a page of API results. */
export function applyLocalOverlay(products: Product[]): Product[] {
  const overlay = readOverlay();
  return products
    .filter((p) => !overlay.deletedIds.includes(p.id))
    .map((p) => overlay.updated[p.id] ?? p);
}
