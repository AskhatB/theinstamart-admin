import { Category } from './category';
import { ShopMainInfo } from './shopMainInfo';

export interface Product {
  good_name: string;
  shop_id: number;
  category_id: number;
  subcategory_id: number;
  description: string;
  price: number;
  photos: string[];
  is_available: boolean;
  category: Category;
  subcategory: Category;
  good_id: number;
  shop: ShopMainInfo;
  slug: string;
}

export interface ProductCreation {
  good_name: string;
  shop_id: number;
  category_id: number;
  subcategory_id: number;
  description: string;
  price: number;
  photos: string[];
  is_available: boolean;
}
