// =================================
// PRODUCT REVIEWS SERVICE
// =================================

import { getSupabaseAdmin } from '@/lib/supabase-server';

// Get supabase client
const supabaseAdmin = getSupabaseAdmin();

export interface ReviewData {
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}

export interface ReviewResponse {
  success: boolean;
  review?: any;
  error?: string;
}

export class ReviewsService {
  /**
   * Create a new review
   */
  static async createReview(data: ReviewData): Promise<ReviewResponse> {
    const supabase = supabaseAdmin;

    try {
      // Check if user already reviewed this product
      const { data: existingReview } = await supabase
        .from('product_reviews')
        .select('id')
        .eq('product_id', data.product_id)
        .eq('user_id', data.user_id)
        .single();

      if (existingReview) {
        throw new Error('You have already reviewed this product');
      }

      // Check if user purchased this product
      const { data: orderItem } = await supabase
        .from('order_items')
        .select(`
          orders!inner(
            user_id,
            status
          )
        `)
        .eq('product_id', data.product_id)
        .eq('orders.user_id', data.user_id)
        .eq('orders.status', 'delivered')
        .single();

      const isVerifiedPurchase = !!orderItem;

      // Create review
      const { data: review, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: data.product_id,
          user_id: data.user_id,
          rating: data.rating,
          title: data.title,
          content: data.content,
          images: data.images || [],
          is_verified_purchase: isVerifiedPurchase,
          is_approved: false, // Requires admin approval
        })
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          )
        `)
        .single();

      if (error) throw error;

      return {
        success: true,
        review,
      };
    } catch (error) {
      console.error('Create Review Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create review',
      };
    }
  }

  /**
   * Get reviews for a product
   */
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
    rating?: number,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ success: boolean; reviews?: any[]; error?: string; pagination?: any }> {
    const supabase = supabaseAdmin;

    try {
      const offset = (page - 1) * limit;

      let query = supabase
        .from('product_reviews')
        .select(`
          *,
          users (
            first_name,
            last_name
          )
        `, { count: 'exact' })
        .eq('product_id', productId)
        .eq('is_approved', true);

      if (rating) {
        query = query.eq('rating', rating);
      }

      const { data: reviews, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count || 0,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        reviews,
        pagination,
      };
    } catch (error) {
      console.error('Get Product Reviews Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve reviews',
      };
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ success: boolean; reviews?: any[]; error?: string; pagination?: any }> {
    const supabase = supabaseAdmin;

    try {
      const offset = (page - 1) * limit;

      const { data: reviews, error, count } = await supabase
        .from('product_reviews')
        .select(`
          *,
          products (
            id,
            name,
            slug,
            images
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count || 0,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        reviews,
        pagination,
      };
    } catch (error) {
      console.error('Get User Reviews Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve user reviews',
      };
    }
  }

  /**
   * Update a review
   */
  static async updateReview(
    reviewId: string,
    userId: string,
    data: Partial<ReviewData>
  ): Promise<ReviewResponse> {
    const supabase = supabaseAdmin;

    try {
      // Check if review belongs to user
      const { data: existingReview } = await supabase
        .from('product_reviews')
        .select('user_id')
        .eq('id', reviewId)
        .single();

      if (!existingReview || existingReview.user_id !== userId) {
        throw new Error('Review not found or access denied');
      }

      // Update review
      const { data: review, error } = await supabase
        .from('product_reviews')
        .update({
          rating: data.rating,
          title: data.title,
          content: data.content,
          images: data.images,
          is_approved: false, // Reset approval status after edit
        })
        .eq('id', reviewId)
        .select(`
          *,
          users (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      return {
        success: true,
        review,
      };
    } catch (error) {
      console.error('Update Review Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update review',
      };
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string, userId: string): Promise<ReviewResponse> {
    const supabase = supabaseAdmin;

    try {
      // Check if review belongs to user
      const { data: existingReview } = await supabase
        .from('product_reviews')
        .select('user_id')
        .eq('id', reviewId)
        .single();

      if (!existingReview || existingReview.user_id !== userId) {
        throw new Error('Review not found or access denied');
      }

      // Delete review
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      return {
        success: true,
      };
    } catch (error) {
      console.error('Delete Review Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete review',
      };
    }
  }

  /**
   * Mark review as helpful
   */
  static async markReviewHelpful(reviewId: string): Promise<ReviewResponse> {
    const supabase = supabaseAdmin;

    try {
      const { data: review, error } = await supabase
        .from('product_reviews')
        .update({
          helpful_count: supabaseAdmin.rpc('increment_helpful_count', { review_id: reviewId }),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        review,
      };
    } catch (error) {
      console.error('Mark Review Helpful Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark review as helpful',
      };
    }
  }

  /**
   * Get review statistics for a product
   */
  static async getProductReviewStats(productId: string): Promise<{
    success: boolean;
    stats?: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
      verifiedPurchasePercentage: number;
    };
    error?: string;
  }> {
    const supabase = supabaseAdmin;

    try {
      // Get all approved reviews for the product
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('rating, is_verified_purchase')
        .eq('product_id', productId)
        .eq('is_approved', true);

      if (error) throw error;

      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews!.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
        : 0;

      // Calculate rating distribution
      const ratingDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      reviews?.forEach((review: any) => {
        ratingDistribution[review.rating]++;
      });

      // Calculate verified purchase percentage
      const verifiedPurchases = reviews?.filter((review: any) => review.is_verified_purchase).length || 0;
      const verifiedPurchasePercentage = totalReviews > 0 
        ? (verifiedPurchases / totalReviews) * 100 
        : 0;

      return {
        success: true,
        stats: {
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          totalReviews,
          ratingDistribution,
          verifiedPurchasePercentage: Math.round(verifiedPurchasePercentage),
        },
      };
    } catch (error) {
      console.error('Get Product Review Stats Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve review statistics',
      };
    }
  }

  /**
   * Get all reviews (admin)
   */
  static async getAllReviews(
    page: number = 1,
    limit: number = 20,
    status?: 'pending' | 'approved' | 'all'
  ): Promise<{ success: boolean; reviews?: any[]; error?: string; pagination?: any }> {
    const supabase = supabaseAdmin;

    try {
      const offset = (page - 1) * limit;

      let query = supabase
        .from('product_reviews')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          ),
          products (
            name,
            slug
          )
        `, { count: 'exact' });

      if (status === 'pending') {
        query = query.eq('is_approved', false);
      } else if (status === 'approved') {
        query = query.eq('is_approved', true);
      }

      const { data: reviews, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count || 0,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      };

      return {
        success: true,
        reviews,
        pagination,
      };
    } catch (error) {
      console.error('Get All Reviews Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve reviews',
      };
    }
  }

  /**
   * Approve/reject review (admin)
   */
  static async moderateReview(
    reviewId: string,
    approved: boolean
  ): Promise<ReviewResponse> {
    const supabase = supabaseAdmin;

    try {
      const { data: review, error } = await supabase
        .from('product_reviews')
        .update({
          is_approved: approved,
        })
        .eq('id', reviewId)
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          ),
          products (
            name
          )
        `)
        .single();

      if (error) throw error;

      return {
        success: true,
        review,
      };
    } catch (error) {
      console.error('Moderate Review Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to moderate review',
      };
    }
  }
}

export default ReviewsService;
