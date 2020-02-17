import { ShopMainInfo } from '../types/shopMainInfo';
import request from '../configs/instamartApi';

export const createShop = async (shop: ShopMainInfo): Promise<any> => {
  const response = await request.post('/shop/new', shop);
  return response;
};

export const allShops = async (): Promise<ShopMainInfo[]> => {
  const shopIds = await request.get('/shop/all_ids');
  const response = await request.post('/shop', {
    ids: shopIds.data
  });
  return response.data;
};

export const getShop = async (id: number): Promise<any> => {
  const response = await request.get(`/shop/id=${id}`);
  return response.data;
};
