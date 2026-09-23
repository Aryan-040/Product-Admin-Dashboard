import { ProductFilterParams, SortByOption, SortOrderOption } from '@/types/product';

const VALID_LIMITS = [10, 20, 50];
const VALID_SORT_BY: SortByOption[] = ['price', 'rating', 'title', 'id'];
const VALID_ORDERS: SortOrderOption[] = ['asc', 'desc'];

export function parseProductParams(searchParams: { [key: string]: string | string[] | undefined }): ProductFilterParams {
  // Parse Page
  const rawPage = searchParams.page;
  let page = typeof rawPage === 'string' ? parseInt(rawPage, 10) : 1;
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse Limit
  const rawLimit = searchParams.limit;
  let limit = typeof rawLimit === 'string' ? parseInt(rawLimit, 10) : 10;
  if (isNaN(limit) || !VALID_LIMITS.includes(limit)) {
    limit = 10;
  }

  // Parse Search Query
  const rawQ = searchParams.q;
  const q = typeof rawQ === 'string' ? rawQ.trim() : '';

  // Parse Category
  const rawCategory = searchParams.category;
  const category = typeof rawCategory === 'string' ? rawCategory.trim() : '';

  // Parse Sort By
  const rawSortBy = searchParams.sortBy;
  const sortBy = typeof rawSortBy === 'string' && VALID_SORT_BY.includes(rawSortBy as SortByOption)
    ? (rawSortBy as SortByOption)
    : '';

  // Parse Sort Order
  const rawOrder = searchParams.order;
  const order = typeof rawOrder === 'string' && VALID_ORDERS.includes(rawOrder as SortOrderOption)
    ? (rawOrder as SortOrderOption)
    : 'asc';

  return {
    page,
    limit,
    q,
    category,
    sortBy,
    order,
  };
}

export function buildQueryString(params: Partial<ProductFilterParams>): string {
  const query = new URLSearchParams();

  if (params.page && params.page > 1) {
    query.set('page', params.page.toString());
  }

  if (params.limit && params.limit !== 10) {
    query.set('limit', params.limit.toString());
  }

  if (params.q) {
    query.set('q', params.q);
  }

  if (params.category) {
    query.set('category', params.category);
  }

  if (params.sortBy) {
    query.set('sortBy', params.sortBy);
  }

  if (params.order && params.order !== 'asc') {
    query.set('order', params.order);
  }

  const str = query.toString();
  return str ? `?${str}` : '';
}
