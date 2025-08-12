import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Mail, User, CalendarDays } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import DataTable from '@/components/dashboard/DataTable';
import { useEffect } from 'react';
import { fetchUsers } from '@/store/slices/usersSlice';

const UsersListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (value: string) => (<span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-500" />{value}</span>) },
    { key: 'email', label: 'Email', render: (value: string) => (<span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" />{value}</span>) },
    { key: 'role', label: 'Role' },
    { key: 'created_at', label: 'Joined', render: (value: string) => (<span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-500" />{value ? new Date(value).toLocaleDateString() : '-'}</span>) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          All Users
        </h1>
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">User List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found.</div>
            ) : (
              <DataTable columns={columns} data={users} actions={undefined} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersListPage;
