import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Default } from './HeaderNavigation';

import { buildNavigation, isNavigationVisible } from './HeaderNavigation.data';

import type { NavigationItem, NavigationQueryResult } from './HeaderNavigation.types';

jest.mock('next/navigation', () => ({
  usePathname: () => '/products',
}));

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    }
  >) => (
    <a href={href} {...props}>
      {children}
    </a>
  );

  MockLink.displayName = 'MockLink';

  return MockLink;
});

const mockItems: NavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/',
    children: [],
  },
  {
    id: 'products',
    title: 'Products',
    href: '/products',
    children: [
      {
        id: 'living',
        title: 'Living Room',
        href: '/products/living-room',
        children: [],
      },
      {
        id: 'bedroom',
        title: 'Bedroom',
        href: '/products/bedroom',
        children: [],
      },
    ],
  },
  {
    id: 'about',
    title: 'About Us',
    href: '/about',
    children: [],
  },
];

describe('HeaderNavigation', () => {
  it('renders top-level navigation items', () => {
    render(<Default items={mockItems} />);

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
  });

  it('renders Home as the first navigation item', () => {
    render(<Default items={mockItems} />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveTextContent('Home');
  });

  it('renders child pages in the dropdown', () => {
    render(<Default items={mockItems} />);

    expect(screen.getByText('Living Room')).toBeInTheDocument();

    expect(screen.getByText('Bedroom')).toBeInTheDocument();
  });

  it('opens dropdown on button click', () => {
    render(<Default items={mockItems} />);

    const button = screen.getByRole('button', {
      name: 'Toggle Products submenu',
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes dropdown on second click', () => {
    render(<Default items={mockItems} />);

    const button = screen.getByRole('button', {
      name: 'Toggle Products submenu',
    });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('highlights the current page', () => {
    render(<Default items={mockItems} currentPath="/products" />);

    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the mobile navigation', () => {
    render(<Default items={mockItems} />);

    const button = screen.getByRole('button', {
      name: 'Open menu',
    });

    fireEvent.click(button);

    expect(
      screen.getByRole('button', {
        name: 'Close menu',
      })
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders without items', () => {
    render(<Default items={[]} />);

    expect(
      screen.getByRole('navigation', {
        name: 'Main navigation',
      })
    ).toBeInTheDocument();
  });
});

describe('Sitecore navigation mapping', () => {
  it('includes pages with checkbox value 1', () => {
    expect(
      isNavigationVisible({
        id: '1',
        name: 'Products',
        displayInHeader: { value: '1' },
      })
    ).toBe(true);
  });

  it('excludes pages with checkbox value 0', () => {
    expect(
      isNavigationVisible({
        id: '2',
        name: 'Hidden',
        displayInHeader: { value: '0' },
      })
    ).toBe(false);
  });

  it('excludes pages without the checkbox field', () => {
    expect(
      isNavigationVisible({
        id: '3',
        name: 'Hidden',
      })
    ).toBe(false);
  });

  it('filters hidden children and grandchildren', () => {
    const data: NavigationQueryResult = {
      home: {
        id: 'home',
        name: 'Home',
        url: { path: '/' },
        displayInHeader: { value: '1' },
        children: {
          results: [
            {
              id: 'products',
              name: 'Products',
              url: { path: '/products' },
              displayInHeader: { value: '1' },
              children: {
                results: [
                  {
                    id: 'living',
                    name: 'Living Room',
                    url: { path: '/products/living' },
                    displayInHeader: { value: '1' },
                  },
                  {
                    id: 'hidden-child',
                    name: 'Hidden Child',
                    url: { path: '/products/hidden' },
                    displayInHeader: { value: '0' },
                  },
                ],
              },
            },
            {
              id: 'hidden',
              name: 'Hidden Page',
              url: { path: '/hidden' },
              displayInHeader: { value: '0' },
            },
          ],
        },
      },
    };

    const navigation = buildNavigation(data);

    expect(navigation).toHaveLength(2);
    expect(navigation[0].title).toBe('Home');
    expect(navigation[1].title).toBe('Products');
    expect(navigation[1].children).toHaveLength(1);
    expect(navigation[1].children[0].title).toBe('Living Room');
  });

  it('uses NavigationTitle when provided', () => {
    const navigation = buildNavigation({
      home: {
        id: 'home',
        name: 'Home',
        displayInHeader: { value: '1' },
        children: {
          results: [
            {
              id: 'services',
              name: 'Our Interior Design Services',
              navigationTitle: { value: 'Services' },
              displayInHeader: { value: '1' },
              url: { path: '/services' },
            },
          ],
        },
      },
    });

    expect(navigation[1].title).toBe('Services');
  });
});
