import type {
  NavigationItem,
  NavigationQueryResult,
  SitecoreNavigationItem,
} from './HeaderNavigation.types';

export const HEADER_NAVIGATION_QUERY = `
    fragment NavigationFields on Item {
      id
      name
      url {
        path
      }
      displayInHeader: field(name: "ShouldDisplayInHeader") {
        value
      }
      navigationTitle: field(name: "NavigationTitle") {
        value
      }
    }
  
    query HeaderNavigation(
      $homePath: String!
      $language: String!
    ) {
      home: item(path: $homePath, language: $language) {
        ...NavigationFields
  
        children(hasLayout: true, first: 100) {
          results {
            ...NavigationFields
  
            children(hasLayout: true, first: 100) {
              results {
                ...NavigationFields
              }
            }
          }
        }
      }
    }
  `;

export function isNavigationVisible(item: SitecoreNavigationItem): boolean {
  const value = item.displayInHeader?.value;

  return value === '1' || value?.toLowerCase() === 'true';
}

function mapItem(item: SitecoreNavigationItem): NavigationItem {
  return {
    id: item.id,
    title: item.navigationTitle?.value?.trim() || item.name,
    href: item.url?.path || '/',
    children: (item.children?.results || []).filter(isNavigationVisible).map(mapItem),
  };
}

export function buildNavigation(data: NavigationQueryResult): NavigationItem[] {
  if (!data.home) {
    return [];
  }

  const home = data.home;

  const homeItem: NavigationItem = {
    id: home.id,
    title: 'Home',
    href: home.url?.path || '/',
    children: [],
  };

  const childItems = (home.children?.results || []).filter(isNavigationVisible).map(mapItem);

  return [...(isNavigationVisible(home) ? [homeItem] : []), ...childItems];
}
