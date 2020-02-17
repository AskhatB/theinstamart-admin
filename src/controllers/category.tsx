import { Category as CategoryInterface } from '../types/category';
import request from '../configs/instamartApi';

export const getAllCategories = async (): Promise<CategoryInterface[]> => {
  const response = await request.get('/category');
  return response.data;
};
