const FLASH_KEY = "pad_flash";

export function setFlashMessage(message: string): void {
  sessionStorage.setItem(FLASH_KEY, message);
}

export function popFlashMessage(): string | null {
  const message = sessionStorage.getItem(FLASH_KEY);
  if (message) sessionStorage.removeItem(FLASH_KEY);
  return message;
}
