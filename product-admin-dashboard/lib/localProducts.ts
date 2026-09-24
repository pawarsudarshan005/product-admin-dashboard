import type { Product } from "@/types/product";

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

export function getLocalProduct(id: number): Product | undefined {
  const overlay = readOverlay();
  return overlay.created.find((p) => p.id === id) ?? overlay.updated[id];
}

export function isLocallyDeleted(id: number): boolean {
  return readOverlay().deletedIds.includes(id);
}

export function applyLocalOverlay(products: Product[]): Product[] {
  const overlay = readOverlay();
  return products
    .filter((p) => !overlay.deletedIds.includes(p.id))
    .map((p) => overlay.updated[p.id] ?? p);
}
