import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Verify from './verify';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams('?success=true&orderId=123')]
  };
});

describe('Verify Component', () => {
  const defaultContext = {
    url: 'http://localhost:4000'
  };

  const renderWithContext = (contextValue = defaultContext) => {
    return render(
      <BrowserRouter>
        <StoreContext.Provider value={contextValue}>
          <Verify />
        </StoreContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders verification message', () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Act
    renderWithContext();
    
    // Assert
    expect(screen.getByText(/Verifying your payment/i)).toBeInTheDocument();
  });

  test('renders loading spinner', () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { success: true } });
    const { container } = renderWithContext();
    
    // Assert
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('calls verification API on mount', async () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Act
    renderWithContext();
    
    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/order/verify',
        { success: 'true', orderId: '123' }
      );
    });
  });

  test('navigates to myorders on successful verification', async () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Act
    renderWithContext();
    
    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/myorders');
    });
  });

  test('navigates to home on failed verification', async () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { success: false } });
    
    // Act
    renderWithContext();
    
    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles verification error gracefully', async () => {
    // Arrange
    axios.post.mockRejectedValue(new Error('Network error'));
    
    // Act
    renderWithContext();
    
    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});