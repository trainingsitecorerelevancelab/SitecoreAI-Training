import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { INTERIOR_SEARCH_QUERY, buildSearchVariables } from './InteriorProjectSearch.graphql';
import { searchInteriorProjects } from './InteriorProjectSearch.data';
import { Default } from './InteriorProjectSearch';

jest.mock('server-only', () => ({}));

const originalGraphQLEndpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
const originalGraphQLApiKey = process.env.SITECORE_GRAPHQL_API_KEY;

describe('InteriorProjectSearch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(global, 'fetch');
    if (originalGraphQLEndpoint === undefined) {
      Reflect.deleteProperty(process.env, 'SITECORE_GRAPHQL_ENDPOINT');
    } else {
      process.env.SITECORE_GRAPHQL_ENDPOINT = originalGraphQLEndpoint;
    }
    if (originalGraphQLApiKey === undefined) {
      Reflect.deleteProperty(process.env, 'SITECORE_GRAPHQL_API_KEY');
    } else {
      process.env.SITECORE_GRAPHQL_API_KEY = originalGraphQLApiKey;
    }
  });

  it('builds search predicates for keyword and filters', () => {
    expect(
      buildSearchVariables(
        { keyword: '  natural  ', style: 'Modern', room: 'Kitchen', cursor: 'cursor-1' },
        '{A1-B2}',
        '{C3-D4}'
      )
    ).toEqual({
      where: {
        AND: [
          { name: '_templates', value: 'a1b2', operator: 'CONTAINS' },
          { name: '_path', value: 'c3d4', operator: 'CONTAINS' },
          { name: '_language', value: 'en', operator: 'EQ' },
          {
            OR: [
              { name: 'ProjectName', value: 'natural', operator: 'CONTAINS' },
              { name: 'Description', value: 'natural', operator: 'CONTAINS' },
            ],
          },
          { name: 'DesignStyle', value: 'Modern', operator: 'EQ' },
          { name: 'RoomType', value: 'Kitchen', operator: 'EQ' },
        ],
      },
      first: 9,
      after: 'cursor-1',
    });
    expect(INTERIOR_SEARCH_QUERY).toContain('query InteriorSearch');
    expect(INTERIOR_SEARCH_QUERY).toContain('field(name: "DetailPage")');
  });

  it('executes GraphQL on the server and maps detail links and project fields', async () => {
    process.env.SITECORE_GRAPHQL_ENDPOINT = 'https://sitecore.example.com/graphql/edge';
    process.env.SITECORE_GRAPHQL_API_KEY = 'test-key';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          search: {
            total: 1,
            pageInfo: { hasNext: false, endCursor: 'end' },
            results: [
              {
                id: 'project-1',
                name: 'Project one',
                url: { path: '/projects/one' },
                detailPage: { jsonValue: { value: { href: '/details/one' } } },
                projectName: { value: 'Natural home' },
                description: { value: 'A calm, natural interior.' },
                designStyle: { value: 'Modern' },
                roomType: { value: 'Living room' },
                location: { value: 'London' },
                completionDate: { value: '2026-03-01' },
                featured: { value: '1' },
                projectImage: { jsonValue: { value: { src: '/natural-home.jpg' } } },
              },
            ],
          },
        },
      }),
    } as Response);
    Object.defineProperty(global, 'fetch', { configurable: true, value: fetchMock });

    await expect(
      searchInteriorProjects({ keyword: '', style: '', room: '' }, 'template-id', 'root-id')
    ).resolves.toEqual({
      total: 1,
      pageInfo: { hasNext: false, endCursor: 'end' },
      results: [
        {
          id: 'project-1',
          name: 'Project one',
          detailUrl: '/details/one',
          projectName: 'Natural home',
          description: 'A calm, natural interior.',
          designStyle: 'Modern',
          roomType: 'Living room',
          location: 'London',
          completionDate: '2026-03-01',
          featured: '1',
          projectImage: { value: { src: '/natural-home.jpg' } },
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://sitecore.example.com/graphql/edge',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ sc_apikey: 'test-key' }),
        body: expect.stringContaining('"query":"\\n  query InteriorSearch'),
        cache: 'no-store',
      })
    );
  });

  it('submits filters and renders linked search results', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 2,
          pageInfo: { hasNext: true, endCursor: 'cursor-2' },
          results: [
            {
              id: 'project-1',
              name: 'Project one',
              detailUrl: '/details/one',
              projectName: 'Natural home',
              description: 'A calm, natural interior.',
              designStyle: 'Modern',
              roomType: 'Living room',
              location: 'London',
              completionDate: '2026-03-01',
              featured: 'true',
              projectImage: { value: { src: '/natural-home.jpg' } },
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total: 2,
          pageInfo: { hasNext: false, endCursor: null },
          results: [
            {
              id: 'project-2',
              name: 'Project two',
              detailUrl: '/details/two',
              projectName: 'City apartment',
              description: 'A contemporary city home.',
              designStyle: 'Contemporary',
              roomType: 'Kitchen',
              location: 'Oxford',
              completionDate: '2026-04-01',
              featured: '',
              projectImage: null,
            },
          ],
        }),
      } as Response);
    Object.defineProperty(global, 'fetch', { configurable: true, value: fetchMock });

    render(
      <Default
        fields={{
          TemplateId: { value: 'template-id' },
          RootId: { value: 'root-id' },
        }}
      />
    );

    fireEvent.change(screen.getByLabelText('Keyword'), { target: { value: 'natural' } });
    fireEvent.change(screen.getByLabelText('Design style'), { target: { value: 'Modern' } });
    fireEvent.change(screen.getByLabelText('Room type'), { target: { value: 'Living room' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByRole('heading', { name: 'Natural home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Natural home' })).toHaveAttribute(
      'href',
      '/details/one'
    );
    expect(screen.getByText('A calm, natural interior.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Natural home' })).toHaveAttribute(
      'src',
      '/natural-home.jpg'
    );
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/interior-project-search',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          criteria: { keyword: 'natural', style: 'Modern', room: 'Living room' },
          templateId: 'template-id',
          rootId: 'root-id',
        }),
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByRole('heading', { name: 'City apartment' })).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 projects')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/interior-project-search',
      expect.objectContaining({
        body: JSON.stringify({
          criteria: {
            keyword: 'natural',
            style: 'Modern',
            room: 'Living room',
            cursor: 'cursor-2',
          },
          templateId: 'template-id',
          rootId: 'root-id',
        }),
      })
    );
  });
});
