export interface CategoryNode {
  ID: string;
  key: string;
  title: string;
  NAME: string;
  children?: CategoryNode[];
}

export interface CategoriesResponse {
  items: CategoryNode[];
  ids: number[];
}
