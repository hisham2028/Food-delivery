import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { StoreContext } from '../../context/StoreContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Navbar Component', () => {
  const mockSetShowLogin = vi.fn();
  const mockSetToken = vi.fn();

  const defaultContext = {
    cartItems: {},
    token: '',
    setToken: mockSetToken,
    getTotalCartAmount: () => 0,
  };

  const renderWithContext = (contextValue = defaultContext) => {
    return render(
      <BrowserRouter>
        <StoreContext.Provider value={contextValue}>
          <Navbar setShowLogin={mockSetShowLogin} />
        </StoreContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders navbar with logo', () => {
    renderWithContext();
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders navigation menu items', () => {
    renderWithContext();
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('menu')).toBeInTheDocument();
    expect(screen.getByText('our services')).toBeInTheDocument();
    expect(screen.getByText('contact-us')).toBeInTheDocument();
  });

  test('renders sign in button when not authenticated', () => {
    renderWithContext();
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  test('calls setShowLogin when sign in button is clicked', () => {
    renderWithContext();
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    expect(mockSetShowLogin).toHaveBeenCalledWith(true);
  });

  test('renders profile dropdown when authenticated', () => {
    const contextWithToken = { ...defaultContext, token: 'test-token' };
    renderWithContext(contextWithToken);
    const profileIcon = screen.getByAltText('Profile');
    expect(profileIcon).toBeInTheDocument();
  });

  test('displays cart dot when items in cart', () => {
    const contextWithCart = { ...defaultContext, getTotalCartAmount: () => 25 };
    const { container } = renderWithContext(contextWithCart);
    const dot = container.querySelector('.dot');
    expect(dot).toBeInTheDocument();
  });

  test('does not display cart dot when cart is empty', () => {
    const { container } = renderWithContext();
    const dot = container.querySelector('.dot');
    expect(dot).not.toBeInTheDocument();
  });

  test('toggles search input visibility', () => {
    const { container } = renderWithContext();
    const searchIcon = screen.getByAltText('Search');
    fireEvent.click(searchIcon);
    const searchContainer = container.querySelector('.navbar-search-container');
    expect(searchContainer).toHaveClass('active');
  });

  test('handles search form submission', () => {
    renderWithContext();
    const searchIcon = screen.getByAltText('Search');
    fireEvent.click(searchIcon);
    const searchInput = screen.getByPlaceholderText('Search items...');
    fireEvent.change(searchInput, { target: { value: 'pizza' } });
    fireEvent.submit(searchInput.closest('form'));
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=pizza');
  });

  test('logs out user when logout is clicked', () => {
    const contextWithToken = { ...defaultContext, token: 'test-token' };
    renderWithContext(contextWithToken);
    const logoutItem = screen.getByText('Logout');
    fireEvent.click(logoutItem);
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockSetToken).toHaveBeenCalledWith('');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to orders page when Orders is clicked', () => {
    const contextWithToken = { ...defaultContext, token: 'test-token' };
    renderWithContext(contextWithToken);
    const ordersItem = screen.getByText('Orders');
    fireEvent.click(ordersItem);
    expect(mockNavigate).toHaveBeenCalledWith('/myorders');
  });

  test('applies sticky class on scroll', () => {
    const { container } = renderWithContext();
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(container.querySelector('.navbar')).toBeInTheDocument();
  });
});