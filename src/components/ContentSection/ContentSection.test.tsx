import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Default } from './ContentSection';
import type { ContentSectionFields } from './ContentSection.types';

import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ElementType, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';

interface MockTextProps extends HTMLAttributes<HTMLElement> {
  field?: Field<string>;
  tag?: ElementType;
}

interface MockRichTextProps extends HTMLAttributes<HTMLDivElement> {
  field?: Field<string>;
}

interface MockImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  field?: ImageField;
}

interface MockLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  field?: LinkField;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span', ...props }: MockTextProps) => (
    <Tag {...props}>{field?.value}</Tag>
  ),

  RichText: ({ field, ...props }: MockRichTextProps) => (
    <div
      {...props}
      dangerouslySetInnerHTML={{
        __html: field?.value || '',
      }}
    />
  ),

  Image: ({ field, ...props }: MockImageProps) => (
    <img
      {...props}
      src={field?.value?.src}
      alt={typeof field?.value?.alt === 'string' ? field.value.alt : ''}
    />
  ),

  Link: ({ field, ...props }: MockLinkProps) => (
    <a href={field?.value?.href} {...props}>
      {field?.value?.text}
    </a>
  ),
}));

describe('ContentSection Component', () => {
  const mockFields: ContentSectionFields = {
    Heading: {
      value: 'About Our Company',
    },
    Description: {
      value: '<p>We create beautiful interiors.</p>',
    },
    SectionImage: {
      value: {
        src: '/images/about.jpg',
        alt: 'About Us',
      },
    },
    CTA: {
      value: {
        href: '/contact',
        text: 'Contact Us',
        linktype: 'internal',
      },
    },
    ImagePosition: {
      value: 'Right',
    },
    BackgroundStyle: {
      value: 'White',
    },
  };

  it('renders the heading', () => {
    render(<Default fields={mockFields} />);

    expect(
      screen.getByRole('heading', {
        name: 'About Our Company',
      })
    ).toBeInTheDocument();
  });

  it('renders rich text description', () => {
    render(<Default fields={mockFields} />);

    expect(screen.getByText('We create beautiful interiors.')).toBeInTheDocument();
  });

  it('renders the image', () => {
    render(<Default fields={mockFields} />);

    expect(screen.getByRole('img', { name: 'About Us' })).toBeInTheDocument();
  });

  it('renders the CTA link', () => {
    render(<Default fields={mockFields} />);

    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
  });

  it('renders image-left layout', () => {
    const fields = {
      ...mockFields,
      ImagePosition: { value: 'Left' },
    };

    const { container } = render(<Default fields={fields} />);

    expect(container.querySelector('section')).toHaveClass('imageLeft');
  });

  it('renders light grey background', () => {
    const fields = {
      ...mockFields,
      BackgroundStyle: { value: 'LightGrey' },
    };

    const { container } = render(<Default fields={fields} />);

    expect(container.querySelector('section')).toHaveClass('lightGrey');
  });

  it('renders datasource warning when fields are missing', () => {
    render(<Default />);

    expect(screen.getByText('ContentSection datasource is not assigned.')).toBeInTheDocument();
  });

  it('does not render CTA when link is missing', () => {
    const fields = {
      ...mockFields,
      CTA: { value: {} },
    } as ContentSectionFields;

    render(<Default fields={fields} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
