export interface StudentProfile {
  name: string;
  regNo: string;
  programme: string;
  school: string;
  yearOfStudy: string;
  semester: string;
  campus: 'Main Campus (Chepkoilel)' | 'Town Campus (Musco Towers)';
  photoUrl: string;
  barcode: string;
  nationalId: string;
  bloodGroup: string;
  validUntil: string;
  clearanceStatus: 'Cleared' | 'Pending Fee' | 'Under Review';
  mealWalletBalance: number;
}

export interface LectureItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  room: string;
  campus: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  attendanceConfirmed?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Beverages';
  priceKes: number;
  calories: string;
  isAvailable: boolean;
  isPopular?: boolean;
  dietary: 'Vegetarian' | 'Non-Vegetarian';
}

export interface MealVoucher {
  voucherId: string;
  items: { name: string; quantity: number; price: number }[];
  totalKes: number;
  timestamp: string;
  expiryTime: string;
  qrCode: string;
  status: 'Active' | 'Redeemed' | 'Expired';
}

export interface HostelRoom {
  id: string;
  hallName: string;
  gender: 'Male' | 'Female' | 'Co-ed';
  roomNumber: string;
  floor: string;
  totalBeds: number;
  occupiedBeds: number;
  pricePerSemester: number;
  amenities: string[];
}

export interface ShuttleSchedule {
  id: string;
  busNumber: string;
  departurePoint: string;
  destination: string;
  departureTime: string;
  estimatedArrival: string;
  status: 'Boarding' | 'On Time' | 'Departed' | 'Scheduled';
  totalSeats: number;
  availableSeats: number;
  driverName: string;
}

export interface FeeItem {
  id: string;
  title: string;
  amountKes: number;
  status: 'Paid' | 'Pending';
}

export interface PollQuestion {
  id: string;
  title: string;
  description: string;
  category: string;
  options: { id: string; label: string; votes: number }[];
  totalVotes: number;
  deadline: string;
  userVotedOptionId?: string;
}
