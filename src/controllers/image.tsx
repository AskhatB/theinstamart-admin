import request from '../configs/instamartApi';

export const uploadToStore = async (images: string[]): Promise<string[]> => {
  const response = await request.post('/uploader/images', {
    imgs: images
  });
  return response.data;
};
