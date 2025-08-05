import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking } from '../../types';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Receipt, 
  Download,
  ArrowRight
} from 'lucide-react';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return <div>Booking not found</div>;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const generateQRCode = () => {
    // This would generate a QR code in a real implementation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your parking slot has been successfully reserved.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium text-gray-900">#{booking.id}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{booking.locationName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Car className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Slot Number</p>
                  <p className="font-medium text-gray-900">#{booking.slotNumber}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Start Time</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.startTime)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">End Time</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.endTime)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">${booking.totalAmount}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Payment Status: Paid</p>
              </div>
            </div>
          </div>

          {/* QR Code & Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Access Code</h2>
            
            <div className="text-center mb-6">
              <img
                src={generateQRCode()}
                alt="QR Code"
                className="mx-auto mb-4 border rounded-lg"
              />
              <p className="text-sm text-gray-600">
                Show this QR code at the parking entrance
              </p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
              
              <button
                onClick={() => navigate('/customer/bookings')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                View My Bookings
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• Please arrive on time. Your slot will be held for 15 minutes after the start time.</li>
            <li>• Show the QR code to the parking attendant or scan it at the entrance.</li>
            <li>• You will receive a reminder 30 minutes before your slot expires.</li>
            <li>• For any issues, contact customer support at support@smartpark.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;