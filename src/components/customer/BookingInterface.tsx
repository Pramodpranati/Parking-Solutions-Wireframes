import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ParkingSlot, Booking } from '../../types';
import { 
  Car, 
  Bike, 
  Truck, 
  Calendar, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Check,
  ArrowLeft
} from 'lucide-react';

const BookingInterface: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { parkingLocations, addBooking, currentUser } = useAppContext();
  const navigate = useNavigate();
  
  const location = parkingLocations.find(loc => loc.id === locationId);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!location) {
    return <div>Location not found</div>;
  }

  const availableSlots = location.slots.filter(slot => slot.status === 'available');

  const getSlotColor = (slot: ParkingSlot) => {
    if (selectedSlot?.id === slot.id) {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }
    switch (slot.status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'booked':
        return 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed';
      case 'disabled':
        return 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'bike':
        return <Bike className="w-4 h-4" />;
      case 'van':
        return <Truck className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const calculateTotal = () => {
    if (!selectedSlot || !startTime || !endTime) return 0;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    return hours * selectedSlot.price;
  };

  const handleBooking = async () => {
    if (!selectedSlot || !startTime || !endTime || !vehicleNumber || !currentUser) return;
    
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: currentUser.id,
      slotId: selectedSlot.id,
      locationId: location.id,
      locationName: location.name,
      slotNumber: selectedSlot.number,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalAmount: calculateTotal(),
      status: 'active',
      paymentStatus: 'paid',
      vehicleType: selectedSlot.vehicleType,
      vehicleNumber
    };

    addBooking(newBooking);
    setLoading(false);
    
    navigate('/customer/confirmation', { state: { booking: newBooking } });
  };

  const canProceed = selectedSlot && startTime && endTime && vehicleNumber;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/customer/search')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
              <p className="text-gray-600">{location.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slot Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Parking Slot</h2>
              <div className="grid grid-cols-10 gap-2">
                {location.slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                    disabled={slot.status !== 'available'}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200
                      ${getSlotColor(slot)}
                      ${slot.status === 'available' ? 'hover:scale-105' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center">
                      {getVehicleIcon(slot.vehicleType)}
                      <span className="text-xs font-medium mt-1">{slot.number}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span>Disabled</span>
                  </div>
                </div>
                <span className="text-gray-600">
                  {availableSlots.length} of {location.totalSlots} available
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      min={startTime}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g., ABC 123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {selectedSlot && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Slot</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Slot Number</span>
                    <span className="text-sm font-medium text-gray-900">#{selectedSlot.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vehicle Type</span>
                    <div className="flex items-center space-x-1">
                      {getVehicleIcon(selectedSlot.vehicleType)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedSlot.vehicleType}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rate</span>
                    <span className="text-sm font-medium text-gray-900">${selectedSlot.price}/hour</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {startTime && endTime ? 
                      `${Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60))} hours`
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${selectedSlot?.price || 0}/hour
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleBooking}
              disabled={!canProceed || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ${calculateTotal()}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInterface;