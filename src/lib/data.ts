export type Categories =
  | "Advertising, Printing, & Media"
  | "Ceramics, Glass & Porcelain"
  | "Food & Beverages"
  | "Automotive & Components"
  | "Computer & Services"
  | "Wood Industry"
  | "Fashion"
  | "Perdagangan"
  | "Craft / Kriya"
  | "Sports"
  | "Others";

export const CATEGORY_LIST: Categories[] = [
  "Advertising, Printing, & Media",
  "Ceramics, Glass & Porcelain",
  "Food & Beverages",
  "Automotive & Components",
  "Computer & Services",
  "Wood Industry",
  "Fashion",
  "Perdagangan",
  "Craft / Kriya",
  "Sports",
  "Others",
];

export type FirebaseProduct = Record<string, unknown>;

export type ProductPayload = {
  nama: string; // Nama
  nim: string; // NIM
  no_hp: string; // Nomor Telepon
  nama_bisnis: string; // Nama Bisnis
  tanggal_berdiri: string; // Tanggal Berdiri
  tanggal_diserahkan: string; // Tanggal Diserahkan
  nomer_induk_barang: string; // Nomer Induk Barang
  lokasi_barang: string; // Lokasi Barang
  kategori_bisnis: Categories; // Kategori Bisnis
  nama_produk: string; // Nama Produk
  stok_barang: string; // Stok Barang
  harga_produk: string; // Harga Produk
  foto_produk: string; // Foto Produk
};

export type Product = ProductPayload & {
  id: string;
};

export type ProductSortKey = Exclude<keyof Product, "id">;

// Helpers
const toString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toStockString = (value: unknown): string => {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "string") return value;
  return "";
};

export const normalizeCategory = (value: unknown): Categories => {
  if (typeof value !== "string") return "Others";
  return CATEGORY_LIST.includes(value as Categories)
    ? (value as Categories)
    : "Others";
};

// Mapping Firebase → Product
export const mapFirebaseProduct = (
  id: string,
  data: FirebaseProduct
): Product => ({
  id,
  nama: toString(data["Nama"]),
  nim: toString(data["NIM"]),
  no_hp: toString(data["Nomor Telepon"]),
  nama_bisnis: toString(data["Nama Bisnis"]),
  tanggal_berdiri: toString(data["Tanggal Berdiri"]),
  tanggal_diserahkan: toString(data["Tanggal Diserahkan"]),
  nomer_induk_barang: toString(data["Nomer Induk Barang"]),
  lokasi_barang: toString(data["Lokasi Barang"]),
  kategori_bisnis: normalizeCategory(data["Kategori Bisnis"]),
  nama_produk: toString(data["Nama Produk"]),
  stok_barang: toStockString(data["Stok Barang"]),
  harga_produk: toString(data["Harga Produk"]),
  foto_produk: toString(data["Foto Produk"]),
});

// Mapping Product → Firebase payload (untuk simpan)
export const productToFirebasePayload = (product: ProductPayload) => ({
  Nama: product.nama ?? "",
  NIM: product.nim ?? "",
  "Nomor Telepon": product.no_hp ?? "",
  "Nama Bisnis": product.nama_bisnis ?? "",
  "Tanggal Berdiri": product.tanggal_berdiri ?? "",
  "Tanggal Diserahkan": product.tanggal_diserahkan ?? "",
  "Nomer Induk Barang": product.nomer_induk_barang ?? "",
  "Lokasi Barang": product.lokasi_barang ?? "",
  "Kategori Bisnis": product.kategori_bisnis ?? "Others",
  "Nama Produk": product.nama_produk ?? "",
  "Stok Barang": product.stok_barang ?? "",
  "Harga Produk": product.harga_produk ?? "",
  "Foto Produk": product.foto_produk ?? "",
});

// Payload versi sharing (tanpa data pribadi)
export const productToSharedFirebasePayload = (product: ProductPayload) => ({
  "Nama Bisnis": product.nama_bisnis ?? "",
  "Tanggal Berdiri": product.tanggal_berdiri ?? "",
  "Tanggal Diserahkan": product.tanggal_diserahkan ?? "",
  "Nomer Induk Barang": product.nomer_induk_barang ?? "",
  "Lokasi Barang": product.lokasi_barang ?? "",
  "Kategori Bisnis": product.kategori_bisnis ?? "Others",
  "Nama Produk": product.nama_produk ?? "",
  "Stok Barang": product.stok_barang ?? "",
  "Harga Produk": product.harga_produk ?? "",
  "Foto Produk": product.foto_produk ?? "",
});

export const normalizeProductName = (value: string) => value.trim().toLowerCase();
