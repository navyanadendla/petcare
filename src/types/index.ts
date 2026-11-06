export type UserRole = 'owner' | 'vet' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  clinicName?: string;
  specialization?: string;
  licenseNumber?: string;
  status: 'active' | 'pending' | 'verified';
  createdAt: string;
}

export type AnimalType = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';

export interface Pet {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  type: AnimalType;
  breed: string;
  ageYears: number;
  ageMonths: number;
  birthDate?: string;
  gender: 'Male' | 'Female';
  weightKg: number;
  color: string;
  microchipId?: string;
  photoUrl: string;
  allergies?: string;
  specialNeeds?: string;
  medicalHistorySummary?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  petName: string;
  vetId: string;
  vetName: string;
  clinicName: string;
  date: string;
  type: 'General Checkup' | 'Vaccination' | 'Surgery' | 'Dental Care' | 'Diagnostic' | 'Emergency';
  diagnosis: string;
  treatment: string;
  temperature?: string;
  weight?: number;
  notes?: string;
  followUpDate?: string;
  prescriptions?: string[];
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  petName: string;
  vaccineName: string;
  dateAdministered: string;
  dueDate: string;
  status: 'Up to date' | 'Due Soon' | 'Overdue';
  batchNumber?: string;
  vetName: string;
  vetId: string;
  notes?: string;
}

export interface Medication {
  id: string;
  petId: string;
  petName: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  instructions: string;
  prescribedBy: string;
  status: 'Active' | 'Completed';
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petType: AnimalType;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  vetId: string;
  vetName: string;
  clinicName: string;
  date: string;
  timeSlot: string;
  serviceType: 'General Checkup' | 'Vaccination' | 'Dental Care' | 'Surgery Consult' | 'Nutritional Advice' | 'Emergency';
  notes?: string;
  status: AppointmentStatus;
  diagnosisSummary?: string;
  prescriptionSummary?: string;
  createdAt: string;
}

export interface NutritionPlan {
  id: string;
  petId: string;
  petName: string;
  foodType: 'Dry Kibble' | 'Wet Food' | 'Raw Food' | 'Prescription Diet' | 'Custom Mix';
  brand: string;
  portionGrams: number;
  frequencyTimesPerDay: number;
  meals: {
    id: string;
    time: string;
    title: string;
    portion: string;
    completedToday: boolean;
  }[];
  calorieTargetKcal: number;
  allergies: string[];
  dietaryGuidelines: string[];
  hydrationNotes: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'vaccine' | 'appointment' | 'medication' | 'health_alert' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}
