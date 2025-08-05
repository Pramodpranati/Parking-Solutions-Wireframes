import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ParkingSlot } from '../../types';
import { Car, Bike, Truck, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

const ParkingSlotManager: React.FC = () => {
  const { parkingLocations, updateParkingLocation } = useAppContext();
  const [selectedLocation, setSelectedLocation] = useState(parkingLocations[0]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const getSlotColor = (slot: ParkingSlot) => {
    switch (slot.status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'booked':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'disabled':
        return 'bg-gray-100 border-gray-300 text-gray-500';
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

  const toggleSlotStatus = (slotId: string) => {
    const updatedSlots = selectedLocation.slots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: slot.status === 'disabled' ? 'available' : 'disabled'
        };
      }
      return slot;
    });

    const updatedLocation = {
      ...selectedLocation,
      slots: updatedSlots,
      availableSlots: updatedSlots.filter(slot => slot.status === 'available').length
    };

    updateParkingLocation(updatedLocation);
    setSelectedLocation(updatedLocation);
  };

  const updateSlotPrice = (slotId: string, newPrice: number) => {
    const updatedSlots = selectedLocation.slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, price: newPrice };
      }
      return slot;
    });

    const updatedLocation = {
      ...selectedLocation,
      slots: updatedSlots
    };

    updateParkingLocation(updatedLocation);
    setSelectedLocation(updatedLocation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Parking Slot Manager</h1>
            <select
              value={selectedLocation.id}
              onChange={(e) => setSelectedLocation(parkingLocations.find(loc => loc.id === e.target.value)!)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {parkingLocations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parking Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedLocation.name} - Slot Layout
                </h2>
                <div className="flex items-center space-x-4 text-sm">
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
              </div>

              <div className="grid grid-cols-10 gap-2">
                {selectedLocation.slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                      ${getSlotColor(slot)}
                      ${selectedSlot?.id === slot.id ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center">
                      {getVehicleIcon(slot.vehicleType)}
                      <span className="text-xs font-medium mt-1">{slot.number}</span>
                    </div>
                    {slot.bookedUntil && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slot Details & Controls */}
          <div className="space-y-6">
            {selectedSlot && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Slot #{selectedSlot.number}
                  </h3>
                  <button
                    onClick={() => toggleSlotStatus(selectedSlot.id)}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {selectedSlot.status === 'disabled' ? (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-gray-600">
                      {selectedSlot.status === 'disabled' ? 'Enable' : 'Disable'}
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedSlot.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedSlot.status === 'booked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSlot.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type
                    </label>
                    <div className="flex items-center space-x-2">
                      {getVehicleIcon(selectedSlot.vehicleType)}
                      <span className="text-sm text-gray-900 capitalize">
                        {selectedSlot.vehicleType}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={selectedSlot.price}
                      onChange={(e) => updateSlotPrice(selectedSlot.id, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  {selectedSlot.bookedBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booked By
                      </label>
                      <p className="text-sm text-gray-900">{selectedSlot.bookedBy}</p>
                    </div>
                  )}

                  {selectedSlot.bookedUntil && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booked Until
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSlot.bookedUntil.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Slots</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLocation.totalSlots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-medium text-green-600">{selectedLocation.availableSlots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Booked</span>
                  <span className="text-sm font-medium text-red-600">
                    {selectedLocation.slots.filter(slot => slot.status === 'booked').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Disabled</span>
                  <span className="text-sm font-medium text-gray-500">
                    {selectedLocation.slots.filter(slot => slot.status === 'disabled').length}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Occupancy Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((selectedLocation.totalSlots - selectedLocation.availableSlots) / selectedLocation.totalSlots * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlotManager;