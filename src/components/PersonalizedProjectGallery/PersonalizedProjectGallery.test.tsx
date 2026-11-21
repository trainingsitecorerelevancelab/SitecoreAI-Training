import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default, PersonalizedProjectGalleryView } from './PersonalizedProjectGallery';
import type { GalleryGraphQLResponse } from './PersonalizedProjectGallery.types';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag = 'span',
    className,
  }: {
    field?: { value?: string };
    tag?: string;
    className?: string;
  }) => React.createElement(tag, { className }, field?.value),
  Image: ({
    field,
    className,
  }: {
    field?: { value?: { src?: string; alt?: string } };
    className?: string;
  }) => React.createElement('img', { ...field?.value, className }),
  Link: ({
    field,
    className,
  }: {
    field?: { value?: { href?: string; text?: string } };
    className?: string;
  }) => React.createElement('a', { href: field?.value?.href, className }, field?.value?.text),
}));

const galleryData: GalleryGraphQLResponse = {
  datasource: {
    id: 'gallery-id',
    name: 'Interior Projects',
    heading: { value: 'Our projects' },
    description: { value: 'Explore our work.' },
    projects: {
      targetItems: [
        {
          id: 'project-low',
          name: 'Low priority',
          priority: { value: '1' },
          projectTitle: { value: 'Coastal living room' },
          projectDescription: { value: 'A relaxed coastal interior.' },
          projectImage: { jsonValue: { value: { src: '/coastal.jpg', alt: 'Coastal room' } } },
          designStyle: { value: 'Coastal' },
          roomType: { value: 'Living room' },
          projectLink: {
            jsonValue: { value: { href: '/projects/coastal', text: 'View project' } },
          },
        },
        {
          id: 'project-high',
          name: 'High priority',
          priority: { value: '5' },
          projectTitle: { value: 'Modern kitchen' },
          projectDescription: { value: 'A modern kitchen project.' },
          projectImage: null,
          designStyle: { value: 'Modern' },
          roomType: { value: 'Kitchen' },
          projectLink: null,
        },
      ],
    },
  },
};

describe('PersonalizedProjectGallery', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders project content in descending priority order', () => {
    render(<PersonalizedProjectGalleryView data={galleryData} />);

    expect(screen.getByRole('heading', { name: 'Our projects' })).toBeInTheDocument();
    expect(screen.getByText('Explore our work.')).toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    ).toEqual(['Modern kitchen', 'Coastal living room']);
    expect(screen.getByAltText('Coastal room')).toHaveAttribute('src', '/coastal.jpg');
    expect(screen.getByRole('link', { name: 'View project' })).toHaveAttribute(
      'href',
      '/projects/coastal'
    );
  });

  it('marks a project as liked', () => {
    render(<PersonalizedProjectGalleryView data={galleryData} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'I Like This Design' })[0]);

    expect(screen.getByRole('button', { name: 'Interested ✓' })).toBeInTheDocument();
  });

  it('fetches the GraphQL response through the API route', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => galleryData,
    } as Response);
    global.fetch = fetchMock;

    render(
      <Default
        rendering={{ dataSource: '/sitecore/content/projects' }}
        page={{ locale: 'en-US' }}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Our projects' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/personalized-project-gallery',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          datasourceId: '/sitecore/content/projects',
          language: 'en-US',
        }),
      })
    );
  });

  it('shows an error when the API request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    } as Response);

    render(<Default rendering={{ dataSource: '/sitecore/content/projects' }} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('HTTP error! status: 502');
    });
  });
});
