export interface Product {
  good_name: string;
  shop_id: number;
  category_id: number;
  subcategory_id: number;
  description: string;
  price: number;
  photos: string[];
  is_available: boolean;
}
