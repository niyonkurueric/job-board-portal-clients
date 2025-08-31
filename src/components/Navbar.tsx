import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, CircleUser } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur border-b shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3aafef] rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#222a5f]">JobBoard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-[#3aafef] bg-secondary'
                  : 'text-[#222a5f] hover:text-[#3aafef]'
              }`}
            >
              Jobs
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(logout())}
                  className=" hover:bg-[#3aafef]"
                >
                  Logout
                </Button>
                <CircleUser className="text-[#3aafef]" />
                <span className="text-sm text-foreground font-medium">
                  {user?.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-[#3aafef] bg-secondary'
                      : 'text-[#222a5f] hover:text-foreground'
                  }`}
                >
                  Login
                </Link>
                <Link to="/signup">
                  <Button
                    className={`${
                      isActive('/signup')
                        ? 'bg-[#3aafef] text-white '
                        : 'bg-white text-[#3aafef]'
                    } `}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
