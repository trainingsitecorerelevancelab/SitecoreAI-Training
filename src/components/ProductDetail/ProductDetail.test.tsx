import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ProductDetail } from './ProductDetail';
// Mock Sitecore Content SDK field components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: { value?: string } }) => <span>{field?.value}</span>,
  RichText: ({ field }: { field?: { value?: string } }) => (
    <div dangerouslySetInnerHTML={{ __html: field?.value ?? '' }} />
  ),
  Image: ({ field }: { field?: { value?: { src?: string; alt?: string } } }) => (
    <img src={field?.value?.src} alt={field?.value?.alt ?? ''} />
  ),
  Link: ({ field }: { field?: { value?: { href?: string; text?: string } } }) => (
    <a href={field?.value?.href}>{field?.value?.text}</a>
  ),
}));

const mockFields = {
  ProductName: {
    value: 'Luxury Sofa',
  },
  Description: {
    value: '<p>Premium interior design sofa</p>',
  },
  Price: {
    value: '£1,299',
  },
  ProductImage: {
    value: {
      src: '/images/luxury-sofa.jpg',
      alt: 'Luxury Sofa',
    },
  },
  ProductLink: {
    value: {
      href: '/products/luxury-sofa',
      text: 'View Product',
    },
  },
};

describe('ProductDetail Component', () => {
  test('renders product name correctly', () => {
    render(<ProductDetail fields={mockFields} />);

    expect(screen.getByText('Luxury Sofa')).toBeInTheDocument();
  });

  test('renders product description', () => {
    render(<ProductDetail fields={mockFields} />);

    expect(screen.getByText('Premium interior design sofa')).toBeInTheDocument();
  });

  test('renders product price', () => {
    render(<ProductDetail fields={mockFields} />);

    expect(screen.getByText('£1,299')).toBeInTheDocument();
  });

  test('renders product image with correct alt text', () => {
    render(<ProductDetail fields={mockFields} />);

    expect(screen.getByAltText('Luxury Sofa')).toHaveAttribute('src', '/images/luxury-sofa.jpg');
  });

  test('renders product link correctly', () => {
    render(<ProductDetail fields={mockFields} />);

    expect(screen.getByRole('link', { name: 'View Product' })).toHaveAttribute(
      'href',
      '/products/luxury-sofa'
    );
  });
});
