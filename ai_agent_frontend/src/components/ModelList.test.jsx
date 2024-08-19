import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ModelList from './ModelList';
import { getModels } from '../services/api';

// Mock the api module
jest.mock('../services/api');

describe('ModelList Component', () => {
  beforeEach(() => {
    getModels.mockReset();
  });

  test('renders loading state initially', () => {
    render(
      <Router>
        <ModelList showNotification={() => {}} />
      </Router>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders models when API call is successful', async () => {
    const mockModels = [
      { id: 1, name: 'Model 1', description: 'Description 1' },
      { id: 2, name: 'Model 2', description: 'Description 2' },
    ];

    getModels.mockResolvedValue({
      data: {
        models: mockModels,
        total: 2,
      },
    });

    render(
      <Router>
        <ModelList showNotification={() => {}} />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
      expect(screen.getByText('Model 2')).toBeInTheDocument();
    });
  });

  test('renders error message when API call fails', async () => {
    getModels.mockRejectedValue(new Error('API Error'));

    render(
      <Router>
        <ModelList showNotification={() => {}} />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch models. Please try again later.')).toBeInTheDocument();
    });
  });
});