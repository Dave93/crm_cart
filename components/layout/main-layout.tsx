'use client';

import { CartContainer } from '@/components/cart/cart-container';
import { RelatedProducts } from '@/components/products/related-products';
import { ProductSearch } from '@/components/products/product-search';
import { CategoryTree } from '@/components/categories/category-tree';
import { ProductList } from '@/components/products/product-list';

export function MainLayout() {
  return (
    <div className="space-y-3">
      {/* Cart Section */}
      <section>
        <h3 className="font-semibold text-sm text-foreground mb-2">
          Товары в корзине
        </h3>
        <CartContainer />
      </section>

      {/* Recommendations */}
      <section>
        <h3 className="font-semibold text-sm text-foreground mb-2">
          Рекомендуемые товары
        </h3>
        <RelatedProducts />
      </section>

      {/* Products Catalog */}
      <section>
        <h3 className="font-semibold text-sm text-foreground mb-2">
          Добавить товары в корзину
        </h3>
        <ProductSearch />
        <div className="grid grid-cols-12 gap-3 mt-3">
          <div className="col-span-3">
            <CategoryTree />
          </div>
          <div className="col-span-9">
            <ProductList />
          </div>
        </div>
      </section>
    </div>
  );
}
