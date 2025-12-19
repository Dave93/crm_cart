// Base API response wrapper
export interface ApiResponse<T> {
  result: T;
  error?: string;
}

// URL Parameters from Bitrix24 integration
export interface UrlParams {
  dealId: string | null;
  project: string;
  terminal: string | null;
  fuser: string | null;
}
