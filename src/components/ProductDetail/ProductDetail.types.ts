import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export interface ProductDetailFields {
  ProductName: Field<string>;
  Description: Field<string>;
  Price: Field<string>;
  ProductImage: ImageField;
  ProductLink: LinkField;
}

export interface ProductDetailProps {
  fields?: ProductDetailFields;
}
