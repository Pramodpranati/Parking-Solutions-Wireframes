export const PARKING_FEATURES = [
  {
    id: 'covered-parking',
    name: 'Covered Parking',
    description: 'Protected from weather elements',
    icon: 'Umbrella'
  },
  {
    id: 'ev-charging',
    name: 'EV Charging',
    description: 'Electric vehicle charging stations',
    icon: 'Zap'
  },
  {
    id: 'surveillance',
    name: 'Surveillance',
    description: '24/7 CCTV monitoring',
    icon: 'Camera'
  },
  {
    id: 'covered-car',
    name: 'Covered Car Parking',
    description: 'Dedicated covered spaces for cars',
    icon: 'Car'
  },
  {
    id: 'covered-ev',
    name: 'Covered EV Parking',
    description: 'Covered parking with EV charging',
    icon: 'Battery'
  },
  {
    id: 'covered-truck',
    name: 'Covered Truck Parking',
    description: 'Large covered spaces for trucks',
    icon: 'Truck'
  },
  {
    id: 'ev-truck',
    name: 'EV Truck Charging',
    description: 'High-power charging for electric trucks',
    icon: 'Plug'
  },
  {
    id: 'security',
    name: 'Security Guard',
    description: 'On-site security personnel',
    icon: 'Shield'
  },
  {
    id: 'restroom',
    name: 'Restroom Facilities',
    description: 'Clean restroom facilities available',
    icon: 'Home'
  },
  {
    id: 'wheelchair',
    name: 'Wheelchair Accessible',
    description: 'ADA compliant accessibility',
    icon: 'Accessibility'
  }
];

export const PARKING_TYPES = [
  { value: 'outdoor', label: 'Outdoor Parking' },
  { value: 'indoor', label: 'Indoor Parking' },
  { value: 'multi-level', label: 'Multi-Level Garage' },
  { value: 'street', label: 'Street Parking' },
  { value: 'garage', label: 'Private Garage' }
];

export const VEHICLE_TYPES = [
  { value: 'car', label: 'Car', icon: 'Car' },
  { value: 'bike', label: 'Motorcycle/Bike', icon: 'Bike' },
  { value: 'van', label: 'Van', icon: 'Truck' },
  { value: 'truck', label: 'Truck', icon: 'Truck' }
];

export const TIME_SLOTS = [
  { value: 'peak', label: 'Peak Hours', description: 'High demand periods' },
  { value: 'off-peak', label: 'Off-Peak Hours', description: 'Regular demand periods' },
  { value: 'night', label: 'Night Hours', description: 'Low demand periods' }
];

export const WEEKDAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];