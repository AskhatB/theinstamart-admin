import {
  Category as CategoryInterface,
  CategoryCreation as CategoryCreationInterface
} from '../types/category';
import request from '../configs/instamartApi';

export const getAllCategories = async (): Promise<CategoryInterface[]> => {
  const response = await request.get('/category');
  return response.data;
};

export const createCategory = async (data: CategoryCreationInterface): Promise<any> => {
  const response = await request.post('/category/new', data);
  return response.data;
};
