import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { CartResponse, AddToCartPayload } from '@/types/cart';
import type { ApiResponse, UrlParams } from '@/types/api';

export async function fetchCart(params: UrlParams): Promise<CartResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('project', params.project);

  if (params.dealId) searchParams.set('dealId', params.dealId);
  if (params.fuser) searchParams.set('fuser', params.fuser);

  const { data } = await apiClient.get<ApiResponse<CartResponse>>(
    `${ENDPOINTS.LOAD_CART}?${searchParams.toString()}`
  );

  return data.result;
}

export async function addToCart(payload: AddToCartPayload): Promise<void> {
  await apiClient.post(ENDPOINTS.ADD_TO_CART, payload);
}

export async function increaseCartItem(
  rowId: string,
  project: string
): Promise<void> {
  await apiClient.get(
    `${ENDPOINTS.INCREASE_ITEM}?rowId=${rowId}&quantity=1&project=${project}`
  );
}

export async function decreaseCartItem(
  rowId: string,
  project: string
): Promise<void> {
  await apiClient.get(
    `${ENDPOINTS.DECREASE_ITEM}?rowId=${rowId}&quantity=1&project=${project}`
  );
}

export async function deleteCartItem(
  rowId: string,
  project: string
): Promise<void> {
  await apiClient.get(
    `${ENDPOINTS.DELETE_ITEM}?rowId=${rowId}&project=${project}`
  );
}
