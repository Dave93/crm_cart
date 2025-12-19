import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Product, RelatedProduct } from '@/types/product';
import type { ApiResponse, UrlParams } from '@/types/api';

export async function fetchProducts(params: UrlParams): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('project', params.project);

  if (params.dealId) searchParams.set('dealId', params.dealId);
  if (params.terminal) searchParams.set('terminal', params.terminal);

  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `${ENDPOINTS.GET_PRODUCTS}?${searchParams.toString()}`
  );

  return data.result;
}

export async function fetchRelatedProducts(
  params: UrlParams
): Promise<RelatedProduct[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('project', params.project);

  if (params.dealId) searchParams.set('dealId', params.dealId);
  if (params.terminal) searchParams.set('terminal', params.terminal);
  if (params.fuser) searchParams.set('fuser', params.fuser);

  const { data } = await apiClient.get<ApiResponse<RelatedProduct[]>>(
    `${ENDPOINTS.GET_RELATED_ITEMS}?${searchParams.toString()}`
  );

  return data.result;
}
