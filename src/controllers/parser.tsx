import request from '../configs/instamartApi';

export const getShop = async (instagramLogin: string): Promise<any> => {
  const response = await request.get(`/instaparser/${instagramLogin}/30`);
  return response.data;
};
