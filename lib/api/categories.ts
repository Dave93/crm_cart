import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { CategoriesResponse } from '@/types/category';
import type { ApiResponse, UrlParams } from '@/types/api';

export async function fetchCategories(
  params: UrlParams
): Promise<CategoriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('project', params.project);

  if (params.dealId) searchParams.set('dealId', params.dealId);

  const { data } = await apiClient.get<ApiResponse<CategoriesResponse>>(
    `${ENDPOINTS.GET_CATEGORIES}?${searchParams.toString()}`
  );

  return data.result;
}
