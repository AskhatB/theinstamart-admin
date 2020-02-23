import request from '../configs/instamartApi';
import { Product as ProductInterface } from '../types/product';

export const createProduct = async (data: ProductInterface): Promise<any> => {
  const response = await request.post('/good/new', data);
  return response.data;
};

export const getProductsByShop = async (id: number): Promise<any> => {
  const response = await request.get(`/good/shop_id=${id}`);
  return response.data;
};
