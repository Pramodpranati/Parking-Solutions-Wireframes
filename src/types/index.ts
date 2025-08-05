export interface ParkingSlot {
  id: string;
  number: number;
  status: 'available' | 'booked' | 'disabled';
  vehicleType: 'car' | 'bike' | 'van';
  price: number;
  location: string;
  bookedBy?: string;
  bookedUntil?: Date;
}

export interface ParkingFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface WeekdaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface PriceRule {
  id: string;
  name: string;
  vehicleType: 'car' | 'bike' | 'van' | 'truck';
  timeSlot: 'peak' | 'off-peak' | 'night';
  startTime: string;
  endTime: string;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  geoLocation: GeoLocation;
  parkingType: 'outdoor' | 'indoor' | 'multi-level' | 'street' | 'garage';
  contactPrimary: string;
  contactSecondary?: string;
  features: string[];
  totalSlots: number;
  availableSlots: number;
  maxBookableSlots: number;
  operatingHours: {
    defaultOpen: string;
    defaultClose: string;
    weekdaySchedule: WeekdaySchedule[];
  };
  priceRules: PriceRule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  slots: ParkingSlot[];
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  locationId: string;
  locationName: string;
  slotNumber: number;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  vehicleType: 'car' | 'bike' | 'van';
  vehicleNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'dealer' | 'customer';
  phone?: string;
}