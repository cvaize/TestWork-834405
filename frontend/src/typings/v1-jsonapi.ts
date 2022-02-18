export enum v1JsonapiTypes {
  Category = "categories",
  Product = "products",
}

export enum v1JsonapiTypesCamelCase {
  Category = "categories",
  Product = "products",
}

export type v1Category = v1DefaultModel & {
  id?: string;
  name?: string;
  ordering?: number;
};

export enum v1CategoryAttributes {
  name = "name",
  ordering = "ordering",
}

export enum v1CategoryFilters {
  id = "id",
  name = "name",
}

export type v1CategoryTransferEntity = v1TransferEntity & {
  type: v1JsonapiTypes.Category;
  attributes: {
    name?: string;
    ordering?: number;
  };
  relationships?: {};
};

export type v1Product = v1DefaultModel & {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  ordering?: number;
  category_id?: number;
  category?: v1Category;
};

export enum v1ProductAttributes {
  name = "name",
  description = "description",
  price = "price",
  ordering = "ordering",
  category_id = "category_id",
  category = "category",
}

export enum v1ProductRelations {
  category = "category",
}

export enum v1ProductFilters {
  id = "id",
  name = "name",
}

export type v1ProductTransferEntity = v1TransferEntity & {
  type: v1JsonapiTypes.Product;
  attributes: {
    name?: string;
    description?: string;
    price?: number;
    ordering?: number;
    category_id?: number;
  };
  relationships?: {
    category: {
      data: {
        id: string;
        type: v1JsonapiTypes.Category;
      };
    };
  };
};

export type v1JsonapiTransferEntitys =
  | v1CategoryTransferEntity
  | v1ProductTransferEntity;

export type v1TransferEntityCoupling = {
  type: v1JsonapiTypes;
  id?: string;
};

export type v1TransferEntity = v1TransferEntityCoupling & {
  attributes: {
    [key: string]: string | number | boolean | null;
  };
  relationships?: {
    [key: string]: {
      data: v1TransferEntityCoupling | v1TransferEntityCoupling[];
      meta?: {
        count?: number;
      };
    };
  };
};

export type v1DefaultModel = {
  id?: string;
};
