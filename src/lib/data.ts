export type Product = {
  biaya_prototype: number;
  foto: string;
  harga: number;
  kode: string;
  link: string; //link == medsos
  nama: string;
  nim: number;
  no_hp: number;
  produk: string;
  category: categories;
};

export type categories = 'Food & Beverage' | 'Fashion' | 'Technology' | 'Services' | 'Health & Beauty' | 'Education' | 'Others';


