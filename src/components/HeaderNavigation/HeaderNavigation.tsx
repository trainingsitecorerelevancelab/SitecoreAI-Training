import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './HeaderNavigation.module.css';

import type { HeaderNavigationProps, NavigationItem } from './HeaderNavigation.types';

export const Default = ({ items, currentPath, className }: HeaderNavigationProps) => {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname ?? '/';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const normalizePath = (path: string): string => {
    if (path === '/') return '/';
    return path.replace(/\/+$/, '');
  };

  const isActive = (href: string): boolean => normalizePath(activePath) === normalizePath(href);

  const isBranchActive = (item: NavigationItem): boolean =>
    isActive(item.href) || item.children.some((child) => isActive(child.href));

  const closeMenus = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown((previous) => (previous === id ? null : id));
  };

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <nav className={styles.navigation} aria-label="Main navigation">
        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="header-navigation-list"
          onClick={() => setMobileOpen((previous) => !previous)}
        >
          <span className={styles.hamburger} aria-hidden="true">
            ☰
          </span>
        </button>

        <ul
          id="header-navigation-list"
          className={`${styles.menu} ${mobileOpen ? styles.menuOpen : ''}`}
        >
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const dropdownOpen = openDropdown === item.id;

            return (
              <li
                key={item.id}
                className={`${styles.menuItem} ${hasChildren ? styles.hasDropdown : ''}`}
              >
                <div className={styles.menuItemContent}>
                  <Link
                    href={item.href}
                    className={`${styles.menuLink} ${isBranchActive(item) ? styles.active : ''}`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onClick={closeMenus}
                  >
                    {item.title}
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      className={styles.dropdownToggle}
                      aria-label={`Toggle ${item.title} submenu`}
                      aria-expanded={dropdownOpen}
                      aria-controls={`submenu-${item.id}`}
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <span aria-hidden="true">⌄</span>
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <ul
                    id={`submenu-${item.id}`}
                    className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}
                  >
                    {item.children.map((child) => (
                      <li key={child.id} className={styles.dropdownItem}>
                        <Link
                          href={child.href}
                          className={`${styles.dropdownLink} ${
                            isActive(child.href) ? styles.active : ''
                          }`}
                          aria-current={isActive(child.href) ? 'page' : undefined}
                          onClick={closeMenus}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
