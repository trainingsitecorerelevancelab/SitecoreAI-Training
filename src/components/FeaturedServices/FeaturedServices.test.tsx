import type { ElementType, HTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Default } from './FeaturedServices';

const originalFetch = global.fetch;

interface MockTextProps extends HTMLAttributes<HTMLElement> {
  field?: { value?: string };
  tag?: ElementType;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span', ...props }: MockTextProps) => (
    <Tag {...props}>{field?.value}</Tag>
  ),

  Image: ({
    field,
    ...props
  }: {
    field: { value?: { src?: string; alt?: string } };
    className?: string;
  }) => <img src={field.value?.src} alt={field.value?.alt ?? ''} {...props} />,
}));

describe('FeaturedServices', () => {
  beforeEach(() => {
    process.env.SITECORE_GRAPHQL_ENDPOINT =
      'https://xmc-relevancela07f3-sitecoreaiec25-demoe802.sitecorecloud.io/sitecore/api/graph/edge';
    process.env.SITECORE_GRAPHQL_API_KEY = '077e41c385e24643bf965412b73cc592';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      Reflect.deleteProperty(global, 'fetch');
    }
  });

  it('renders selected services from GraphQL', async () => {
    const mockResponse = {
      data: {
        item: {
          id: 'featured-1',
          heading: {
            jsonValue: { value: 'Our Featured Services' },
          },
          selectedServices: {
            targetItems: [
              {
                id: 'service-1',
                serviceName: {
                  jsonValue: { value: 'Kitchen Design' },
                },
                description: {
                  jsonValue: { value: 'Beautiful kitchens' },
                },
                serviceImage: {
                  jsonValue: {
                    value: {
                      src: '/kitchen.jpg',
                      alt: 'Kitchen',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const component = await Default({
      rendering: { dataSource: 'featured-1' },
      page: { locale: 'en' },
    });

    render(component);

    expect(screen.getByText('Our Featured Services')).toBeInTheDocument();

    expect(screen.getByText('Kitchen Design')).toBeInTheDocument();

    expect(screen.getByText('Beautiful kitchens')).toBeInTheDocument();
  });
});
