import { Product, ProductPayload } from "./data";

const SEQ_DIGITS = 3;

const ID_MONTHS: Record<string, number> = {
  januari: 1,
  jan: 1,
  februari: 2,
  feb: 2,
  maret: 3,
  mar: 3,
  april: 4,
  apr: 4,
  mei: 5,
  juni: 6,
  jun: 6,
  juli: 7,
  jul: 7,
  agustus: 8,
  agu: 8,
  agt: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  oktober: 10,
  okt: 10,
  oct: 10,
  november: 11,
  nov: 11,
  desember: 12,
  des: 12,
  dec: 12,
};

const normalizeName = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getIdentity = (product: ProductPayload) => {
  const fields = [product.nama_bisnis, product.nama, product.nama_produk];
  for (const field of fields) {
    if (field) return normalizeName(field);
  }
  return "";
};

const padSeq = (value: number) => String(value).padStart(SEQ_DIGITS, "0");

const parseMonthYear = (raw: string | number | null | undefined) => {
  if (raw == null) return null;

  if (typeof raw === "number") {
    const numericDate = new Date(raw);
    if (!Number.isNaN(numericDate.getTime())) {
      return { year: numericDate.getFullYear(), month: numericDate.getMonth() + 1 };
    }
  }

  const value = String(raw).trim();
  if (!value) return null;

  const isoDate = new Date(value);
  if (!Number.isNaN(isoDate.getTime())) {
    return { year: isoDate.getFullYear(), month: isoDate.getMonth() + 1 };
  }

  const indoMatch = value.match(/(\d{1,2})\s+([A-Za-zÀ-ÿ\.]+)\s+(\d{4})/);
  if (indoMatch) {
    const monthStr = indoMatch[2].toLowerCase().replace(/\./g, "");
    const month = ID_MONTHS[monthStr];
    if (month) {
      return { year: Number.parseInt(indoMatch[3], 10), month };
    }
  }

  const dmyMatch = value.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
  if (dmyMatch) {
    const month = Number.parseInt(dmyMatch[2], 10);
    const year = Number.parseInt(dmyMatch[3], 10);
    if (month >= 1 && month <= 12) return { year, month };
  }

  const ymdMatch = value.match(/(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})/);
  if (ymdMatch) {
    const month = Number.parseInt(ymdMatch[2], 10);
    const year = Number.parseInt(ymdMatch[1], 10);
    if (month >= 1 && month <= 12) return { year, month };
  }

  return null;
};

const bucketKeyFromDate = (raw: string | number | null | undefined) => {
  const parsed = parseMonthYear(raw);
  if (!parsed) return null;
  return `${parsed.year}.${String(parsed.month).padStart(2, "0")}`;
};

const parseExistingCode = (code?: string | null) => {
  if (!code) return null;
  const match = String(code).match(/^(\d{4}\.\d{2})-(\d{1,})$/);
  if (!match) return null;
  const seq = Number.parseInt(match[2], 10);
  if (!Number.isFinite(seq)) return null;
  return { ym: match[1], seq };
};

export const generateNomerIndukBarang = (
  product: ProductPayload,
  existingProducts: Product[]
) => {
  const ym = bucketKeyFromDate(product.tanggal_diserahkan);
  if (!ym) return null;

  const identity = getIdentity(product);
  const nameToSeq = new Map<string, number>();
  let maxSeq = 0;

  existingProducts.forEach((existing) => {
    if (bucketKeyFromDate(existing.tanggal_diserahkan) !== ym) return;
    const parsed = parseExistingCode(existing.nomer_induk_barang);
    if (!parsed || parsed.ym !== ym) return;

    maxSeq = Math.max(maxSeq, parsed.seq);
    const existingIdentity = getIdentity(existing);
    if (existingIdentity && !nameToSeq.has(existingIdentity)) {
      nameToSeq.set(existingIdentity, parsed.seq);
    }
  });

  const assignedSeq = identity && nameToSeq.has(identity)
    ? nameToSeq.get(identity)
    : maxSeq + 1;

  return `${ym}-${padSeq(assignedSeq ?? 1)}`;
};
