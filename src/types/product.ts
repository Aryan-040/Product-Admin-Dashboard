export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    barcode?: string;
    qrCode?: string;
  };
  images: string[];
  thumbnail: string;
  // Flag for client-side local additions/edits
  isLocal?: boolean;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export type Category = string | CategoryItem;

export type SortByOption = 'price' | 'rating' | 'title' | 'id';
export type SortOrderOption = 'asc' | 'desc';

export interface ProductFilterParams {
  page: number;
  limit: number;
  q: string;
  category: string;
  sortBy: SortByOption | '';
  order: SortOrderOption;
  delay?: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  thumbnail: string;
}
