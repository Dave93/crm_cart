export interface ProductModifier {
  ID: string;
  PRODUCT_ID: string;
  NAME: string;
  PRICE: number;
}

export interface Product {
  ID: string;
  PRODUCT_ID: string;
  NAME: string;
  PRICE: number;
  IBLOCK_SECTION_ID: string;
  AVAILABLE: boolean;
  modifiers: ProductModifier[] | null;
}

export interface RelatedProduct {
  PRODUCT_ID: string;
  NAME: string;
}
