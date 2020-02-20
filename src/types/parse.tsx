export interface SinglePost {
  comments_disabled: boolean;
  instagram_predict: string;
  post_id: number | null;
  post_images_urls: string[];
  post_text: string
  timestamp: number
}