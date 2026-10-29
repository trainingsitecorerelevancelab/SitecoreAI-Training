export interface SitecoreField {
  value?: string | null;
}

export interface SitecoreNavigationItem {
  id: string;
  name: string;
  url?: {
    path: string;
  } | null;
  displayInHeader?: SitecoreField | null;
  navigationTitle?: SitecoreField | null;
  children?: {
    results: SitecoreNavigationItem[];
  } | null;
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  children: NavigationItem[];
}

export interface HeaderNavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  className?: string;
}

export interface NavigationQueryResult {
  home: SitecoreNavigationItem | null;
}
