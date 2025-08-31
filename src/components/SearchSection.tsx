import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSearchQuery, setSelectedLocation } from '@/store/slices/jobsSlice';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Star, Users, Award } from 'lucide-react';
import LocationSelect from './common/LocationSelect';
import { fetchLocations } from '@/api/jobsApi';

const SearchSection = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedLocation } = useSelector(
    (state: RootState) => state.jobs
  );
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localLocation, setLocalLocation] = useState(selectedLocation);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    fetchLocations().then((data) => {
      let locations = data as any;
      if (
        locations &&
        typeof locations === 'object' &&
        'data' in locations &&
        locations.data
      ) {
        setZones(locations.data.map((item) => ({ label: item, value: item })));
      }
    });
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
    dispatch(setSelectedLocation(localLocation));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gray-50 mt-4 min-h-[470px] flex items-center">
      {/* Decorative shapes - hidden on xs */}
      <div className="hidden sm:block absolute top-20 left-10 w-4 h-4 bg-pink-300 rounded-full opacity-60" />
      <div className="hidden sm:block absolute top-32 right-20 w-6 h-6 bg-yellow-300 rotate-45 opacity-60" />
      <div className="hidden sm:block absolute bottom-32 left-16 w-8 h-8 bg-green-300 rounded-full opacity-60" />
      <div className="hidden sm:block absolute bottom-20 right-32 w-5 h-5 bg-purple-300 rotate-12 opacity-60" />
      <div className="hidden sm:block absolute top-40 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-60" />
      <div className="hidden sm:block absolute bottom-40 right-1/4 w-4 h-4 bg-orange-300 rotate-45 opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content and Search */}
          <div className="space-y-8 text-center sm:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#222a5f] leading-tight">
                Find Perfect
                <br className="hidden sm:block" />
                Jobs
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg mx-auto sm:mx-0">
                Grow your business with the top freelancing website.
              </p>
            </div>

            {/* Search Form */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl mx-auto">
              {/* Location Dropdown */}
              <div className="relative w-full md:w-64">
                <LocationSelect
                  value={selectedLocation}
                  onChange={(value) =>
                    dispatch(
                      setSelectedLocation(
                        value === 'all-locations' ? '' : value
                      )
                    )
                  }
                  locations={[
                    { label: 'All location', value: 'all-locations' },
                    ...zones
                  ]}
                />{' '}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for jobs or keywords..."
                  value={localSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalSearch(value);
                    if (value.trim() === '') {
                      // Reset to show all jobs when cleared
                      dispatch(setSearchQuery(''));
                      dispatch(setSelectedLocation(localLocation));
                    }
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#3aafef] text-white rounded-xl font-semibold hover:bg-[#1b89c4ff] transition"
              >
                Find Job
              </button>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative z-10">
                {/* Person illustration */}
                <div className="w-48 sm:w-64 h-64 sm:h-80 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-full relative mx-auto">
                  {/* Head */}
                  <div className="absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-12 sm:h-16 bg-yellow-400 rounded-full" />
                  {/* Body */}
                  <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-24 sm:h-32 bg-blue-500 rounded-lg">
                    {/* Arms */}
                    <div className="absolute -left-5 sm:-left-6 top-6 sm:top-8 w-10 sm:w-12 h-3 sm:h-4 bg-blue-500 rounded-full rotate-12" />
                    <div className="absolute -right-5 sm:-right-6 top-6 sm:top-8 w-10 sm:w-12 h-3 sm:h-4 bg-blue-500 rounded-full -rotate-12" />
                  </div>
                  {/* Legs */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gray-700 rounded-b-lg" />
                    <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gray-700 rounded-b-lg" />
                  </div>
                </div>

                {/* Floating UI elements */}
                <div className="absolute -top-4 -right-6 sm:-right-8 bg-white rounded-lg shadow-lg p-2 sm:p-3 transform rotate-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-[#3aafef] rounded-full flex items-center justify-center">
                      <Users className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-800">
                      Profile
                    </div>
                  </div>
                </div>

                <div className="absolute top-12 sm:top-16 -left-10 sm:-left-12 bg-white rounded-lg shadow-lg p-2 sm:p-3 transform -rotate-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" />
                    <div className="text-xs sm:text-sm font-medium text-gray-800">
                      Reliable
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 bg-white rounded-lg shadow-lg p-3 sm:p-4 transform rotate-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                    Trustworthy
                  </div>
                </div>

                <div className="absolute bottom-12 sm:bottom-16 -left-6 sm:-left-8 bg-[#3aafef] rounded-lg shadow-lg p-2 sm:p-3 text-white transform -rotate-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 sm:w-4 h-3 sm:h-4" />
                    <div className="text-xs sm:text-sm font-medium">
                      New Job!
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -top-10 sm:-top-12 -right-10 sm:-right-12 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-50" />
              <div className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
