import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Mail, User, CalendarDays } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { fetchUsers } from '@/store/slices/usersSlice';
import ResponsiveDataTable from '@/components/common/ResponsiveDataTable';

const UsersListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      ),
      width: '25%',
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{row.email}</span>
        </div>
      ),
      width: '30%',
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
      sortable: true,
      cell: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {row.role}
        </span>
      ),
      width: '15%',
    },
    {
      name: 'Joined',
      selector: (row: any) => row.created_at,
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {row.created_at
              ? new Date(row?.created_at).toLocaleDateString()
              : '-'}
          </span>
        </div>
      ),
      width: '20%',
    }
  ];

  const handleExport = () => {
    // Export users to CSV
    const csvContent = [
      ['ID', 'Name', 'Email', 'Role', 'Joined Date'],
      ...users.map(user => [
        user.id || '',
        user.name || '',
        user.email || '',
        user.role || '',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          All Users
        </h1>
        
        {error ? (
          <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <ResponsiveDataTable
            columns={columns}
            data={users}
            title="Users"
            searchable={true}
            pagination={true}
            selectableRows={false}
            loading={loading}
            exportable={true}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
};

export default UsersListPage;
