export interface CartItemModifier {
  ID: string;
  NAME: string;
  PRICE?: number;
}

export interface CartItem {
  ID: string;
  UF_PRODUCT_ID: string;
  UF_PRODUCT_NAME: string;
  UF_PRICE: number;
  UF_QUANTITY: number;
  UF_MOFIDIERS?: CartItemModifier[]; // Note: typo in original API
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

export interface AddToCartPayload {
  productId: string;
  dealId?: string;
  project?: string;
  fuser?: string;
  modifiers?: string[];
  additional?: boolean;
}
