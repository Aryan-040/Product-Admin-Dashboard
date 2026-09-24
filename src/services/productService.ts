import apiClient from '@/lib/axios';
import { Product, ProductResponse, Category, ProductFilterParams, ProductFormData } from '@/types/product';

export const productService = {
  /**
   * Fetch products with pagination, search, category filter, and sorting.
   * Supports AbortSignal for race condition prevention.
   */
  async getProducts(
    params: ProductFilterParams,
    signal?: AbortSignal
  ): Promise<ProductResponse> {
    const { page, limit, q, category, sortBy, order } = params;
    const skip = (page - 1) * limit;

    let endpoint = '/products';
    const queryParams: Record<string, string | number> = {
      limit,
      skip,
    };

    if (params.delay && params.delay > 0) {
      queryParams.delay = params.delay;
    }

    // Add sorting if specified
    if (sortBy) {
      queryParams.sortBy = sortBy;
      queryParams.order = order || 'asc';
    }

    // Category vs Search logic:
    // If search term is present, use /products/search
    // If category is present and no search term, use /products/category/{category}
    // Note: If both search and category are present, we query search endpoint and filter by category client-side
    if (q.trim()) {
      endpoint = '/products/search';
      queryParams.q = q.trim();
    } else if (category.trim()) {
      endpoint = `/products/category/${encodeURIComponent(category.trim())}`;
    }

    const response = await apiClient.get<ProductResponse>(endpoint, {
      params: queryParams,
      signal,
    });

    let data = response.data;

    // Edge case: If both search 'q' and 'category' were specified, filter returned products by category client-side
    if (q.trim() && category.trim()) {
      const filtered = data.products.filter(
        (p) => p.category.toLowerCase() === category.trim().toLowerCase()
      );
      data = {
        ...data,
        products: filtered,
        total: filtered.length,
      };
    }

    return data;
  },

  /**
   * Fetch category list
   * API: GET /products/categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/products/categories');
    return response.data;
  },

  /**
   * Fetch single product details by ID
   * API: GET /products/[id]
   */
  async getProductById(id: number | string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Add a new product (DummyJSON mock)
   * API: POST /products/add
   */
  async addProduct(productData: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>('/products/add', {
      title: productData.title,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      stock: productData.stock,
      brand: productData.brand || 'Generic',
      thumbnail: productData.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      images: [productData.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      rating: 4.5,
    });
    return response.data;
  },

  /**
   * Update an existing product (DummyJSON mock)
   * API: PUT /products/[id]
   */
  async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product (DummyJSON mock)
   * API: DELETE /products/[id]
   */
  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean }>(`/products/${id}`);
    return response.data;
  },
};
