import {
  Calendar,
  Car,
  DollarSign,
  Settings,
  TrendingUp
} from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../../context/AppContext';

const DealerDashboard: React.FC = () => {
  const { parkingLocations, bookings } = useAppContext();
  const [selectedLocation, setSelectedLocation] = useState(parkingLocations[0]);

  const totalSlots = parkingLocations.reduce((sum, loc) => sum + loc.totalSlots, 0);
  const totalAvailable = parkingLocations.reduce((sum, loc) => sum + loc.availableSlots, 0);
  const totalBooked = totalSlots - totalAvailable;
  const occupancyRate = ((totalBooked / totalSlots) * 100).toFixed(1);

  const todayBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === today.toDateString();
  });

  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const revenueData = [
    { name: 'Mon', revenue: 320 },
    { name: 'Tue', revenue: 280 },
    { name: 'Wed', revenue: 450 },
    { name: 'Thu', revenue: 380 },
    { name: 'Fri', revenue: 520 },
    { name: 'Sat', revenue: 680 },
    { name: 'Sun', revenue: 420 }
  ];

  const pieData = [
    { name: 'Available', value: totalAvailable, color: '#10b981' },
    { name: 'Booked', value: totalBooked, color: '#f59e0b' },
    { name: 'Disabled', value: 8, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Dealer Dashboard</h1>
            <div className="flex items-center space-x-4">
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
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-3xl font-bold text-gray-900">{totalSlots}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{occupancyRate}%</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{todayBookings.length}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Slot Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Slot</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">#{booking.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{booking.locationName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{booking.slotNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {Math.round((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60))}h
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">${booking.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'active' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;