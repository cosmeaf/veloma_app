// src/utils/nif.js
// Valida NIF de 9 dígitos com dígito de controlo (módulo 11)
export function isValidNIF(nif) {
  if (!/^\d{9}$/.test(nif)) return false;
  const digits = nif.split("").map(Number);
  const check = digits[8];
  const sum =
    digits[0] * 9 +
    digits[1] * 8 +
    digits[2] * 7 +
    digits[3] * 6 +
    digits[4] * 5 +
    digits[5] * 4 +
    digits[6] * 3 +
    digits[7] * 2;
  const mod11 = sum % 11;
  const calc = mod11 < 2 ? 0 : 11 - mod11;
  return calc === check;
}

// Normaliza entrada do usuário: somente dígitos, corta em 9
export function normalizeNIF(value = "") {
  return String(value).replace(/\D/g, "").slice(0, 9);
}
