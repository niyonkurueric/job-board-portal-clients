import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Jobs from '../pages/Jobs';
jest.mock('@/api/jobsApi', () => ({
  getAllJobs: jest.fn(() => Promise.resolve([{ id: '1', title: 'Frontend Developer' }]))
}));

describe('Jobs Page', () => {
  it('renders jobs list and search', () => {
    render(<Jobs />);
    expect(screen.getByText(/jobs/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('shows loading indicator', () => {
    // You may need to mock loading state if Jobs uses Redux or hooks
    render(<Jobs />);
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });
});
