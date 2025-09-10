// Vasavi Grand Hotel - Centralized Data Management
export const hotelData = {
  name: "Vasavi Grand",
  location: "Tirupati",
  address: " Rajareddy Nagar, Medigo Hospital lane, road, Mangalam, Tirupati, Andhra Pradesh 517507",
  phone: "+91 9392379785",
  whatsapp: "+91 9392379785",
  email: "vasavigrandtirupati@gmail.com",
  website: "www.vasavigrandthirupati.in",
  gst: "XXXXXXXXXXX"
};


export const billTypes = [
  { id: 1, name: "Booking Confirmation", code: "CONF" },
  { id: 2, name: "Check-In Bill", code: "CHECKIN" },
  { id: 3, name: "Check-Out Bill", code: "CHECKOUT" },
  { id: 4, name: "Advance Booking", code: "ADV" }
];


// Bill number generation
let billCounter = JSON.parse(localStorage.getItem('vasavi_bill_counter')) || 1;

export const generateBillNumber = () => {
  const year = new Date().getFullYear();
  const billNumber = `VG-${year}-${billCounter.toString().padStart(3, '0')}`;
  billCounter++;
  localStorage.setItem('vasavi_bill_counter', JSON.stringify(billCounter));
  return billNumber;
};

export const resetBillCounter = () => {
  billCounter = 1;
  localStorage.setItem('vasavi_bill_counter', JSON.stringify(billCounter));
};

// Form validation rules
export const validationRules = {
  guestName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/
  },
  contactNo: {
    required: true,
    pattern: /^[6-9]\d{9}$/
  },
  adults: {
    required: true,
    min: 1,
    max: 10
  },
  children: {
    required: false,
    min: 0,
    max: 10
  },
  rooms: {
    required: true,
    min: 1,
    max: 20
  }
};

// Default form data structure
export const defaultFormData = {
  guestName: '',
  contactNo: '',
  address: '',
  adults: 1,
  children: 0,
  checkInDate: '',
  checkInTime: '',
  checkOutDate: '',
  checkOutTime: '',
  rooms: 1,
  roomDetails: [{ roomType: '', unitPrice: 0, count: 1 }], // Array to handle multiple room types
  advancePaid: 0,
  beveragesBill: 0, // New field for beverages
  billType: billTypes[0].name,
  specialRequests: ''
};