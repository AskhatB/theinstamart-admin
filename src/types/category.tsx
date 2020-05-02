export interface Category {
  category_id: number;
  category_name: string;
  parent_id?: number;
  category_name_single?: string;
  icon?: string;
  image?: string;
  slug?: string;
}

export interface CategoryCreation {
  category_name: string;
  category_name_single: string;
  icon: string;
  image: string;
  parent_id?: number;
}