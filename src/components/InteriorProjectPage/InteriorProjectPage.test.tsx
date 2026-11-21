import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import { Default } from './InteriorProjectPage';

jest.mock('@sitecore-content-sdk/nextjs', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    useSitecoreContext: jest.fn(),
    Text: ({
      field,
      tag = 'span',
      ...props
    }: {
      field?: { value?: string };
      tag?: string;
      [key: string]: unknown;
    }) => React.createElement(tag, props as React.HTMLAttributes<HTMLElement>, field?.value),
    RichText: ({
      field,
      tag = 'div',
      ...props
    }: {
      field?: { value?: string };
      tag?: string;
      [key: string]: unknown;
    }) =>
      React.createElement(tag, {
        ...props,
        dangerouslySetInnerHTML: { __html: field?.value ?? '' },
      } as React.HTMLAttributes<HTMLElement>),
    Image: ({
      field,
      ...props
    }: {
      field?: { value?: { src?: string } };
      [key: string]: unknown;
    }) => React.createElement('img', { ...props, src: field?.value?.src }),
  };
});

const mockUseSitecoreContext = jest.mocked(useSitecoreContext);

describe('InteriorProjectPage', () => {
  it('renders all interior project page fields semantically', () => {
    mockUseSitecoreContext.mockReturnValue({
      sitecoreContext: {
        route: {
          name: 'modern-london-apartment',
          placeholders: {},
          fields: {
            ProjectName: { value: 'Modern London Apartment' },
            Description: { value: '<p>Contemporary interiors with natural textures.</p>' },
            DesignStyle: { value: 'Modern' },
            RoomType: { value: 'Living Room' },
            Location: { value: 'London' },
            CompletionDate: { value: '20260912T000000Z' },
            ProjectImage: { value: { src: '/modern-london.jpg' } },
            Featured: { value: '1' },
            ProjectKeywords: { value: 'natural textures\ncity apartment' },
          },
        },
      },
    });

    render(<Default />);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('data-search-entity', 'interior_project');
    expect(article).toHaveAttribute('data-design-style', 'Modern');
    expect(article).toHaveAttribute('data-room-type', 'Living Room');
    expect(article).toHaveAttribute('data-featured', 'true');
    expect(article).toHaveAttribute('data-location', 'London');
    expect(article).toHaveAttribute('data-project-keywords', 'natural textures\ncity apartment');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Modern London Apartment' })
    ).toBeVisible();
    expect(screen.getByText('Contemporary interiors with natural textures.')).toBeVisible();
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', '2026-09-12');
    expect(screen.getByRole('time')).toHaveTextContent('September 2026');
    expect(screen.getByRole('img', { name: 'Modern London Apartment' })).toHaveAttribute(
      'src',
      '/modern-london.jpg'
    );
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === 'P' &&
          element.textContent?.replace(/\s+/g, ' ').trim() === 'natural textures city apartment'
      )
    ).toBeVisible();
  });
});
