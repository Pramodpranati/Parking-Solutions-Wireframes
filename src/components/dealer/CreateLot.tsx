import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ParkingLocation, WeekdaySchedule, PriceRule, GeoLocation } from '../../types';
import { PARKING_FEATURES, PARKING_TYPES, VEHICLE_TYPES, TIME_SLOTS, WEEKDAYS } from '../../data/masterData';
import {
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const { addParkingLocation } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    parkingType: 'outdoor' as const,
    contactPrimary: '',
    contactSecondary: '',
    totalSlots: 50,
    features: [] as string[],
    defaultOpen: '06:00',
    defaultClose: '22:00'
  });

  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const [weekdaySchedule, setWeekdaySchedule] = useState<WeekdaySchedule[]>(
    WEEKDAYS.map(day => ({
      day: day.value as WeekdaySchedule['day'],
      isOpen: true,
      openTime: '06:00',
      closeTime: '22:00'
    }))
  );

  const [priceRules, setPriceRules] = useState<PriceRule[]>([
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
  ]);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null); // Renamed for clarity

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleWeekdayChange = (dayIndex: number, field: keyof WeekdaySchedule, value: any) => {
    setWeekdaySchedule(prev =>
      prev.map((schedule, index) =>
        index === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const addPriceRule = () => {
    const newRule: PriceRule = {
      id: Date.now().toString(),
      name: 'New Price Rule',
      vehicleType: 'car',
      timeSlot: 'off-peak',
      startTime: '09:00',
      endTime: '17:00',
      hourlyRate: 3,
      dailyRate: 25
    };
    setPriceRules(prev => [...prev, newRule]);
  };

  const updatePriceRule = (ruleId: string, updates: Partial<PriceRule>) => {
    setPriceRules(prev =>
      prev.map(rule => rule.id === ruleId ? { ...rule, ...updates } : rule)
    );
  };

  const removePriceRule = (ruleId: string) => {
    setPriceRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const handleLocationSearch = async () => {
    // Mock geocoding - in real app, use Google Maps API or similar
    if (geoLocation.address) {
      setGeoLocation(prev => ({
        ...prev,
        latitude: 40.7128 + Math.random() * 0.1,
        longitude: -74.0060 + Math.random() * 0.1
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionMessage(null); // Clear any previous messages

    try {
      const maxBookableSlots = Math.floor(formData.totalSlots * 0.9);

      const newLocation: ParkingLocation = {
        id: Date.now().toString(),
        name: formData.name,
        address: geoLocation.address,
        geoLocation,
        parkingType: formData.parkingType,
        contactPrimary: formData.contactPrimary,
        contactSecondary: formData.contactSecondary,
        features: formData.features,
        totalSlots: formData.totalSlots,
        availableSlots: maxBookableSlots,
        maxBookableSlots,
        operatingHours: {
          defaultOpen: formData.defaultOpen,
          defaultClose: formData.defaultClose,
          weekdaySchedule
        },
        priceRules,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        slots: Array.from({ length: formData.totalSlots }, (_, i) => ({
          id: `slot-${Date.now()}-${i + 1}`,
          number: i + 1,
          status: i < maxBookableSlots ? 'available' : 'disabled',
          vehicleType: 'car',
          price: priceRules[0]?.hourlyRate || 5,
          location: formData.name
        }))
      };

      addParkingLocation(newLocation);
      setSubmissionMessage('Parking lot created successfully!'); // Set success message
      // Removed setTimeout and navigate('/dealer/dashboard');
    } catch (error) {
      console.error('Error creating lot:', error);
      setSubmissionMessage('Error creating parking lot. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Name, type, and contact details' },
    { number: 2, title: 'Location & Features', description: 'Address, geolocation, and amenities' },
    { number: 3, title: 'Operating Hours', description: 'Schedule and availability' },
    { number: 4, title: 'Pricing Rules', description: 'Flexible pricing configuration' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/dealer/dashboard')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Parking Lot</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
                  } transition-all duration-300`}>
                  {step.number}
                </div>
                <div className="ml-3 flex-grow">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                    } transition-colors duration-300`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    } transition-colors duration-300`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., Downtown Plaza Parking"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Type *
                  </label>
                  <select
                    value={formData.parkingType}
                    onChange={(e) => setFormData(prev => ({ ...prev, parkingType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {PARKING_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPrimary}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPrimary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactSecondary}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactSecondary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Slots *
                  </label>
                  <input
                    type="number"
                    value={formData.totalSlots}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalSlots: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="1"
                    max="1000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    90% ({Math.floor(formData.totalSlots * 0.9)}) will be bookable, rest reserved
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Features */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={geoLocation.address}
                        onChange={(e) => setGeoLocation(prev => ({ ...prev, address: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="123 Main Street"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleLocationSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={geoLocation.city}
                      onChange={(e) => setGeoLocation(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={geoLocation.state}
                      onChange={(e) => setGeoLocation(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={geoLocation.zipCode}
                      onChange={(e) => setGeoLocation(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={geoLocation.country}
                      onChange={(e) => setGeoLocation(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {geoLocation.latitude !== 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      📍 Location found: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Parking Features</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PARKING_FEATURES.map(feature => (
                    <div
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.features.includes(feature.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        {formData.features.includes(feature.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Operating Hours */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Operating Hours</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Opening Time
                  </label>
                  <input
                    type="time"
                    value={formData.defaultOpen}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultOpen: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Closing Time
                  </label>
                  <input
                    type="time"
                    value={formData.defaultClose}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultClose: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule</h3>
              <div className="space-y-4">
                {weekdaySchedule.map((schedule, index) => (
                  <div key={schedule.day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <span className="font-medium text-gray-900 capitalize">{schedule.day}</span>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.isOpen}
                        onChange={(e) => handleWeekdayChange(index, 'isOpen', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 transition-colors duration-200"
                      />
                      <span className="ml-2 text-sm text-gray-700">Open</span>
                    </label>

                    {schedule.isOpen && (
                      <>
                        <div>
                          <input
                            type="time"
                            value={schedule.openTime}
                            onChange={(e) => handleWeekdayChange(index, 'openTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <span className="text-gray-500">to</span>
                        <div>
                          <input
                            type="time"
                            value={schedule.closeTime}
                            onChange={(e) => handleWeekdayChange(index, 'closeTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Pricing Rules */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pricing Rules</h2>
                <button
                  type="button"
                  onClick={addPriceRule}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </button>
              </div>

              <div className="space-y-6">
                {priceRules.map((rule, index) => (
                  <div key={rule.id} className="p-6 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Price Rule #{index + 1}</h3>
                      {priceRules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePriceRule(rule.id)}
                          className="p-2 text-red-600 hover:text-red-700 rounded-full transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rule Name
                        </label>
                        <input
                          type="text"
                          value={rule.name}
                          onChange={(e) => updatePriceRule(rule.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Type
                        </label>
                        <select
                          value={rule.vehicleType}
                          onChange={(e) => updatePriceRule(rule.id, { vehicleType: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          {VEHICLE_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Slot
                        </label>
                        <select
                          value={rule.timeSlot}
                          onChange={(e) => updatePriceRule(rule.id, { timeSlot: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          {TIME_SLOTS.map(slot => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={rule.startTime}
                          onChange={(e) => updatePriceRule(rule.id, { startTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={rule.endTime}
                          onChange={(e) => updatePriceRule(rule.id, { endTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={rule.hourlyRate}
                          onChange={(e) => updatePriceRule(rule.id, { hourlyRate: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          min="0"
                          step="0.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Daily Rate ($)
                        </label>
                        <input
                          type="number"
                          value={rule.dailyRate}
                          onChange={(e) => updatePriceRule(rule.id, { dailyRate: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          min="0"
                          step="0.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weekly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={rule.weeklyRate || ''}
                          onChange={(e) => updatePriceRule(rule.id, { weeklyRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          min="0"
                          step="0.5"
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={rule.monthlyRate || ''}
                          onChange={(e) => updatePriceRule(rule.id, { monthlyRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          min="0"
                          step="0.5"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submissionMessage && (
            <div className={`mt-4 p-3 rounded-lg text-center ${submissionMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {submissionMessage}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Previous
            </button>
            <div className="flex space-x-4">

              {
                currentStep === 4 ?
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Create Lot
                  </button> :
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Next
                  </button>
              }

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLot;

