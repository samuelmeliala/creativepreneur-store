export type Product = {
  nama: string;              // dari "Nama"
  nim: string;               // dari "NIM"
  no_hp: string;             // dari "Nomor Telepon"
  nama_bisnis: string;       // dari "Nama Bisnis"
  tanggal_berdiri: string;   // dari "Tanggal Berdiri"
  kategori_bisnis: Categories; // dari "Kategori Bisnis"
  nama_produk: string;       // dari "Nama Produk"
  harga_produk: string;      // dari "Harga Produk"
  tanggal_diserahkan: string; // dari "Tanggal Diserahkan"
  foto_produk: string;       // dari "Foto Produk"
};


export type Categories =
  | 'Food & Beverages'
  | 'Fashion'
  | 'Technology'
  | 'Services'
  | 'Health & Beauty'
  | 'Education'
  | 'Others';


