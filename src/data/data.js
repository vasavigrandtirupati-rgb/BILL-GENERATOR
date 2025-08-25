// Vasavi Grand Hotel - Centralized Data Management
export const hotelData = {
  name: "Vasavi Grand",
  location: "Tirupati",
  address: "123 Temple Street, Tirupati, Andhra Pradesh - 517501",
  phone: "+91 9876543210",
  whatsapp: "+91 9876543210",
  email: "info@vasavigrand.com",
  website: "www.vasavigrand.com",
  gst: "37XXXXX1234X1Z5"
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
  roomType: '',
  unitPrice: 0,
  advancePaid: 0,
  billType: billTypes[0].name,
  specialRequests: ''
};