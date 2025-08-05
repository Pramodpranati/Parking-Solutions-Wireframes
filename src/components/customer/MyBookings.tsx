import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const MyBookings: React.FC = () => {
  const { bookings, currentUser, updateBooking } = useAppContext();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const userBookings = bookings.filter(booking => booking.userId === currentUser?.id);

  const getBookingsByStatus = (status: string) => {
    return userBookings.filter(booking => booking.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const canCancelBooking = (booking: any) => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const timeDiff = startTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return booking.status === 'active' && hoursDiff > 1; // Can cancel if more than 1 hour before start
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBooking(bookingId, { status: 'cancelled' });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const tabs = [
    { key: 'active', label: 'Active', count: getBookingsByStatus('active').length },
    { key: 'completed', label: 'Completed', count: getBookingsByStatus('completed').length },
    { key: 'cancelled', label: 'Cancelled', count: getBookingsByStatus('cancelled').length }
  ];

  const currentBookings = getBookingsByStatus(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Receipt className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">#{booking.id}</span>
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{booking.locationName}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Slot</p>
                        <p className="font-medium text-gray-900">#{booking.slotNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Start</p>
                        <p className="font-medium text-gray-900">{formatDate(booking.startTime)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">End</p>
                        <p className="font-medium text-gray-900">{formatDate(booking.endTime)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Vehicle: {booking.vehicleNumber}</span>
                      <span className="text-sm text-gray-600">
                        Duration: {Math.ceil((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60))}h
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">${booking.totalAmount}</span>
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-600">
              {activeTab === 'active' 
                ? "You don't have any active bookings right now." 
                : `You don't have any ${activeTab} bookings.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;