import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Mail, User, CalendarDays } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
// import DataTable from '@/components/dashboard/DataTable';
import { useEffect } from 'react';
import { fetchUsers } from '@/store/slices/usersSlice';
import DataTable from 'react-data-table-component';

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
      key: 'id',
      name: 'ID',
      selector: (row) => (
        <span className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          {row?.id}
        </span>
      )
    },
    {
      key: 'name',
      name: 'Name',
      selector: (row) => (
        <span className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          {row.name}
        </span>
      )
    },
    {
      key: 'email',
      name: 'Email',
      selector: (row) => (
        <span className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          {row.email}
        </span>
      )
    },
    {
      key: 'role',
      name: 'Role',
      selector: (row) => (
        <span className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          {row.role}
        </span>
      )
    },
    {
      key: 'created_at',
      name: 'Joined',
      selector: (row) => (
        <span className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          {row.created_at
            ? new Date(row?.created_at).toLocaleDateString()
            : '-'}
        </span>
      )
    }
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
            <CardTitle className="text-lg font-semibold text-gray-800">
              User List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading users...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found.
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={users}
                pagination={true}
                paginationPerPage={5}
                fixedHeader={true}
                actions={undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersListPage;
