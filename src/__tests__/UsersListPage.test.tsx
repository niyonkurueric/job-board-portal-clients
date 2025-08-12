import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UsersListPage from '../pages/UsersListPage';
jest.mock('@/store/slices/usersSlice', () => {
  return {
    fetchUsers: () => ({ type: 'users/fetchUsers' })
  };
});

const mockStore = configureStore([]);

describe('UsersListPage', () => {
  it('shows loading state', () => {
    const store = mockStore({ users: { users: [], loading: true, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    const store = mockStore({ users: { users: [], loading: false, error: 'Failed to fetch' } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it('shows no users found', () => {
    const store = mockStore({ users: { users: [], loading: false, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  });

  it('renders users table', () => {
    const store = mockStore({ users: { users: [{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', created_at: '2025-08-12' }], loading: false, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('renders table headers', () => {
    const store = mockStore({ users: { users: [{ id: 1, name: 'Jane Doe', email: 'jane@example.com', role: 'user', created_at: '2025-08-12' }], loading: false, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    expect(screen.getByText(/ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined/i)).toBeInTheDocument();
  });

  it('renders user joined date correctly', () => {
    const store = mockStore({ users: { users: [{ id: 2, name: 'Alice', email: 'alice@example.com', role: 'user', created_at: '2025-08-12' }], loading: false, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    // Date should be formatted as locale date string
    expect(screen.getByText(new Date('2025-08-12').toLocaleDateString())).toBeInTheDocument();
  });

  it('renders icons for name and email columns', () => {
    const store = mockStore({ users: { users: [{ id: 3, name: 'Bob', email: 'bob@example.com', role: 'user', created_at: '2025-08-12' }], loading: false, error: null } });
    render(
      <Provider store={store}>
        <UsersListPage />
      </Provider>
    );
    // Check for SVG icons by their className
    const nameIcon = document.querySelector('.text-blue-500');
    const emailIcon = document.querySelector('.text-gray-500');
    expect(nameIcon).toBeTruthy();
    expect(emailIcon).toBeTruthy();
  });
});
