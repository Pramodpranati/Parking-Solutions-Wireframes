import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Car, 
  Star,
  Navigation,
  Filter
} from 'lucide-react';

const LocationSearch: React.FC = () => {
  const { parkingLocations } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<'car' | 'bike' | 'van'>('car');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'availability'>('distance');
  const navigate = useNavigate();

  const filteredLocations = parkingLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (locationId: string) => {
    navigate(`/customer/booking/${locationId}`);
  };

  const getDistanceText = (location: any) => {
    // Mock distance calculation
    const distance = Math.random() * 5 + 0.5;
    return `${distance.toFixed(1)} km`;
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Parking</h1>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Vehicle Type:</span>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value as 'car' | 'bike' | 'van')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'availability')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="distance">Distance</option>
                  <option value="price">Price</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleLocationSelect(location.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {location.address}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{getDistanceText(location)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">5 min walk</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      ${location.priceRules[0]?.hourlyRate || 5}/hr • ${location.priceRules[0]?.dailyRate || 40}/day
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm font-medium ${getAvailabilityColor(location.availableSlots, location.totalSlots)}`}>
                      {location.availableSlots}/{location.totalSlots} available
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking locations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;