export const ENDPOINTS = {
  // Categories
  GET_CATEGORIES: '/get.product.categories',

  // Products
  GET_PRODUCTS: '/get.product.list',
  GET_RELATED_ITEMS: '/load.related.items',

  // Cart
  LOAD_CART: '/load.cart',
  ADD_TO_CART: '/add.deal.basket.item',
  INCREASE_ITEM: '/increase.basket.item',
  DECREASE_ITEM: '/decrease.basket.item',
  DELETE_ITEM: '/delete.basket.item',
} as const;
