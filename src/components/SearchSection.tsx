import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSearchQuery, setSelectedType, setSelectedLocation } from '@/store/slices/jobsSlice';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';
import LocationSelect from '@/components/common/LocationSelect';
import heroImage from '@/assets/hero-bg.jpg';

const SearchSection = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedLocation } = useSelector((state: RootState) => state.jobs);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section 
      className="relative bg-gradient-hero min-h-[500px] flex items-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover thousands of opportunities from top companies. Your next career move starts here.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2">
                <SearchInput
                  placeholder="Search for jobs or keywords..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <LocationSelect
                value={selectedLocation}
                onChange={(value) => dispatch(setSelectedLocation(value === 'all-locations' ? '' : value))}
              />
              <div className="flex justify-center md:justify-end">
                <Button onClick={handleSearch} size="lg" className="px-8 w-full md:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;