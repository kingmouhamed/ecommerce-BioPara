// =================================
// REVIEW TYPES
// =================================

export interface ReviewData {
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at?: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface ReviewResult {
  success: boolean;
  review?: Review;
  error?: string;
}

export interface ReviewListResult {
  success: boolean;
  reviews?: Review[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  error?: string;
}
