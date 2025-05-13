export type ProductFilters = {
  goal?: string;
  budget?: string;
  category?: string;
};

export type GPTAction = {
  type: 'recommend_products';
  filters: ProductFilters;
};