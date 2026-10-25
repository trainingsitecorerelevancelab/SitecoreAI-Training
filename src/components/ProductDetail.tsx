import React from 'react';
import styles from './ProductDetail.module.css';
import {
  Text,
  RichText,
  Image,
  Link,
  type Field,
  type ImageField,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';

interface ProductDetailFields {
  ProductName: Field<string>;
  Description: Field<string>;
  Price: Field<string>;
  ProductImage: ImageField;
  ProductLink: LinkField;
}

interface ProductDetailProps {
  fields?: ProductDetailFields;
}

export const Default = (props: ProductDetailProps) => {
  const fields = props.fields;

  if (!fields) {
    return <div>Product datasource is not assigned.</div>;
  }

  return (
    <section className={styles.productDetail}>
      <div className={styles.ProductName}>
        <Image field={fields.ProductImage} />
      </div>

      <div className={styles.productInformation}>
        <h2>
          <Text field={fields.ProductName} />
        </h2>

        <div className={styles.productInformation}>
          <RichText field={fields.Description} />
        </div>

        <h3>
          <Text field={fields.Price} />
        </h3>

        <Link field={fields.ProductLink}>View Product</Link>
      </div>
    </section>
  );
};
