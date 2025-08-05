import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ParkingLocation, Booking } from '../types';
import { mockUsers, mockParkingLocations, mockBookings } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  parkingLocations: ParkingLocation[];
  bookings: Booking[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateParkingLocation: (location: ParkingLocation) => void;
  addParkingLocation: (location: ParkingLocation) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>(mockParkingLocations);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && (password === 'password' || password === 'admin')) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateParkingLocation = (location: ParkingLocation) => {
    setParkingLocations(prev => 
      prev.map(loc => loc.id === location.id ? location : loc)
    );
  };

  const addParkingLocation = (location: ParkingLocation) => {
    setParkingLocations(prev => [...prev, location]);
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      parkingLocations,
      bookings,
      login,
      logout,
      updateParkingLocation,
      addParkingLocation,
      addBooking,
      updateBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};