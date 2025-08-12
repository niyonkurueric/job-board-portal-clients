import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CreateJob from '../pages/CreateJob';
import { MemoryRouter } from 'react-router-dom';
jest.mock('@/api/jobsApi', () => ({
  createJob: jest.fn(() => Promise.resolve({ id: '1', title: 'Frontend Developer' })),
  updateJob: jest.fn(() => Promise.resolve({ id: '1', title: 'Frontend Developer' }))
}));

const mockStore = configureMockStore();
const store = mockStore({});
describe('CreateJob Page', () => {
  it('renders job application form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/job description \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create job posting/i })).toBeInTheDocument();
  });

  it('shows error on empty submit', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /create job posting/i }));
    // Multiple required errors may show
    expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
  });

  it('accepts job title and description input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Frontend Developer' } });
    expect(screen.getByLabelText(/title/i)).toHaveValue('Frontend Developer');
    expect(screen.getByText(/job description \*/i)).toBeInTheDocument();
  });
});
