import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSwitcher from './LanguageSwitcher';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = jest.requireMock('next/router').useRouter;

describe('LanguageSwitcher', () => {
  const router = {
    locale: 'en',
    pathname: '/[[...path]]',
    query: { path: ['about'], campaign: 'spring' },
    asPath: '/about?campaign=spring',
    push: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(router);
  });

  it('shows the current locale and available languages', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
    expect(screen.getByRole('option', { name: 'Français' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Deutsch' })).toBeInTheDocument();
  });

  it('changes locale while preserving the current page and query', () => {
    render(<LanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'fr-FR' },
    });

    expect(router.push).toHaveBeenCalledWith(
      {
        pathname: '/[[...path]]',
        query: { path: ['about'], campaign: 'spring' },
      },
      '/about?campaign=spring',
      { locale: 'fr-FR' }
    );
  });
});
