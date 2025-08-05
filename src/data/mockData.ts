import { ParkingLocation, Booking, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Dealer',
    email: 'dealer@example.com',
    type: 'dealer',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Jane Customer',
    email: 'customer@example.com',
    type: 'customer',
    phone: '+0987654321'
  }
];

export const mockParkingLocations: ParkingLocation[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
    address: '123 Main St, Downtown',
    geoLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    parkingType: 'multi-level',
    contactPrimary: '+1 (555) 123-4567',
    contactSecondary: '+1 (555) 123-4568',
    features: ['covered-parking', 'surveillance', 'ev-charging'],
    totalSlots: 50,
    availableSlots: 23,
    maxBookableSlots: 45,
    operatingHours: {
      defaultOpen: '06:00',
      defaultClose: '22:00',
      weekdaySchedule: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '23:00' },
        { day: 'saturday', isOpen: true, openTime: '08:00', closeTime: '23:00' },
        { day: 'sunday', isOpen: true, openTime: '08:00', closeTime: '20:00' }
      ]
    },
    priceRules: [
      {
        id: '1',
        name: 'Car - Peak Hours',
        vehicleType: 'car',
        timeSlot: 'peak',
        startTime: '08:00',
        endTime: '18:00',
        hourlyRate: 5,
        dailyRate: 40,
        weeklyRate: 250,
        monthlyRate: 900
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    slots: Array.from({ length: 50 }, (_, i) => ({
      id: `slot-${i + 1}`,
      number: i + 1,
      status: Math.random() > 0.6 ? 'available' : Math.random() > 0.8 ? 'disabled' : 'booked',
      vehicleType: Math.random() > 0.5 ? 'car' : Math.random() > 0.5 ? 'bike' : 'van',
      price: 5,
      location: 'Downtown Plaza',
      bookedBy: Math.random() > 0.7 ? 'customer@example.com' : undefined,
      bookedUntil: Math.random() > 0.7 ? new Date(Date.now() + 2 * 60 * 60 * 1000) : undefined
    }))
  },
  {
    id: '2',
    name: 'Shopping Center',
    address: '456 Commerce Ave, Midtown',
    geoLocation: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Commerce Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    parkingType: 'outdoor',
    contactPrimary: '+1 (555) 987-6543',
    features: ['surveillance', 'wheelchair'],
    totalSlots: 100,
    availableSlots: 67,
    maxBookableSlots: 90,
    operatingHours: {
      defaultOpen: '07:00',
      defaultClose: '21:00',
      weekdaySchedule: [
        { day: 'monday', isOpen: true, openTime: '07:00', closeTime: '21:00' },
        { day: 'tuesday', isOpen: true, openTime: '07:00', closeTime: '21:00' },
        { day: 'wednesday', isOpen: true, openTime: '07:00', closeTime: '21:00' },
        { day: 'thursday', isOpen: true, openTime: '07:00', closeTime: '21:00' },
        { day: 'friday', isOpen: true, openTime: '07:00', closeTime: '22:00' },
        { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '19:00' }
      ]
    },
    priceRules: [
      {
        id: '2',
        name: 'Car - Regular Hours',
        vehicleType: 'car',
        timeSlot: 'off-peak',
        startTime: '09:00',
        endTime: '17:00',
        hourlyRate: 3,
        dailyRate: 25,
        weeklyRate: 150,
        monthlyRate: 600
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    slots: Array.from({ length: 100 }, (_, i) => ({
      id: `slot-sc-${i + 1}`,
      number: i + 1,
      status: Math.random() > 0.7 ? 'available' : Math.random() > 0.9 ? 'disabled' : 'booked',
      vehicleType: Math.random() > 0.5 ? 'car' : Math.random() > 0.5 ? 'bike' : 'van',
      price: 3,
      location: 'Shopping Center',
      bookedBy: Math.random() > 0.8 ? 'customer@example.com' : undefined,
      bookedUntil: Math.random() > 0.8 ? new Date(Date.now() + 3 * 60 * 60 * 1000) : undefined
    }))
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '2',
    slotId: 'slot-1',
    locationId: '1',
    locationName: 'Downtown Plaza',
    slotNumber: 1,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    totalAmount: 20,
    status: 'active',
    paymentStatus: 'paid',
    vehicleType: 'car',
    vehicleNumber: 'ABC123'
  },
  {
    id: '2',
    userId: '2',
    slotId: 'slot-15',
    locationId: '1',
    locationName: 'Downtown Plaza',
    slotNumber: 15,
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 20 * 60 * 60 * 1000),
    totalAmount: 15,
    status: 'completed',
    paymentStatus: 'paid',
    vehicleType: 'car',
    vehicleNumber: 'XYZ789'
  }
];