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

export type FirebaseProduct = Record<string, unknown>;

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

export type ProductPayload = {
  nama: string; // dari "Nama"
  nim: string; // dari "NIM"
  no_hp: string; // dari "Nomor Telepon"
  nama_bisnis: string; // dari "Nama Bisnis"
  tanggal_berdiri: string; // dari "Tanggal Berdiri"
  kategori_bisnis: Categories; // dari "Kategori Bisnis"
  nama_produk: string; // dari "Nama Produk"
  harga_produk: string; // dari "Harga Produk"
  tanggal_diserahkan: string; // dari "Tanggal Diserahkan"
  foto_produk: string; // dari "Foto Produk"
  lokasi_status: string; // dari "Lokasi"
  stok_barang: string; // dari "Stok Barang"
};

export type Product = ProductPayload & {
  id: string;
};

export type ProductSortKey = Exclude<keyof Product, "id">;

const toString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toStockString = (value: unknown): string => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
};

export const normalizeCategory = (value: unknown): Categories => {
  if (typeof value !== "string") {
    return "Others";
  }

  return CATEGORY_LIST.includes(value as Categories)
    ? (value as Categories)
    : "Others";
};

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
  kategori_bisnis: normalizeCategory(data["Kategori Bisnis"]),
  nama_produk: toString(data["Nama Produk"]),
  harga_produk: toString(data["Harga Produk"]),
  tanggal_diserahkan: toString(data["Tanggal Diserahkan"]),
  foto_produk: toString(data["Foto Produk"]),
  lokasi_status: toString(data["Lokasi"]),
  stok_barang: toStockString(data["Stok Barang"]),
});

export const productToFirebasePayload = (product: ProductPayload) => ({
  Nama: product.nama,
  NIM: product.nim,
  "Nomor Telepon": product.no_hp,
  "Nama Bisnis": product.nama_bisnis,
  "Tanggal Berdiri": product.tanggal_berdiri,
  "Kategori Bisnis": product.kategori_bisnis,
  "Nama Produk": product.nama_produk,
  "Harga Produk": product.harga_produk,
  "Tanggal Diserahkan": product.tanggal_diserahkan,
  "Foto Produk": product.foto_produk,
  Lokasi: product.lokasi_status,
  "Stok Barang": product.stok_barang,
});

export const productToSharedFirebasePayload = (product: ProductPayload) => ({
  "Nama Bisnis": product.nama_bisnis,
  "Tanggal Berdiri": product.tanggal_berdiri,
  "Kategori Bisnis": product.kategori_bisnis,
  "Nama Produk": product.nama_produk,
  "Harga Produk": product.harga_produk,
  "Tanggal Diserahkan": product.tanggal_diserahkan,
  "Foto Produk": product.foto_produk,
  Lokasi: product.lokasi_status,
  "Stok Barang": product.stok_barang,
});

export const normalizeProductName = (value: string) => value.trim().toLowerCase();


