import {
  User,
  Pet,
  VaccinationRecord,
  Medication,
  MedicalRecord,
  Appointment,
  NutritionPlan,
  NotificationItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PETS,
  INITIAL_VACCINATIONS,
  INITIAL_MEDICATIONS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_APPOINTMENTS,
  INITIAL_NUTRITION_PLANS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'petcare_mongodb_users',
  PETS: 'petcare_mongodb_pets',
  VACCINATIONS: 'petcare_mongodb_vaccinations',
  MEDICATIONS: 'petcare_mongodb_medications',
  RECORDS: 'petcare_mongodb_medical_records',
  APPOINTMENTS: 'petcare_mongodb_appointments',
  NUTRITION: 'petcare_mongodb_nutrition',
  NOTIFICATIONS: 'petcare_mongodb_notifications',
  CURRENT_USER: 'petcare_auth_session',
  JWT_TOKEN: 'petcare_jwt_token',
};

// Event emitter for real-time app-wide notifications
type EventCallback = (data: any) => void;
class NotificationEventEmitter {
  private listeners: { [event: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error('Event listener error:', err);
      }
    });
  }
}

export const realTimeBus = new NotificationEventEmitter();

// Helper to load or initialize database collection
function loadCollection<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function saveCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to persist collection:', key, err);
  }
}

export const db = {
  users: {
    find: (): User[] => loadCollection<User>(STORAGE_KEYS.USERS, INITIAL_USERS),
    findById: (id: string): User | undefined => {
      return db.users.find().find(u => u.id === id);
    },
    findByEmail: (email: string): User | undefined => {
      return db.users.find().find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    insert: (user: Omit<User, 'id' | 'createdAt'>): User => {
      const all = db.users.find();
      const newUser: User = {
        ...user,
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      all.push(newUser);
      saveCollection(STORAGE_KEYS.USERS, all);
      return newUser;
    },
    update: (id: string, updates: Partial<User>): User | null => {
      const all = db.users.find();
      const idx = all.findIndex(u => u.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      saveCollection(STORAGE_KEYS.USERS, all);
      return all[idx];
    },
  },

  pets: {
    find: (filter?: { ownerId?: string }): Pet[] => {
      const all = loadCollection<Pet>(STORAGE_KEYS.PETS, INITIAL_PETS);
      if (filter?.ownerId) {
        return all.filter(p => p.ownerId === filter.ownerId);
      }
      return all;
    },
    findById: (id: string): Pet | undefined => {
      return db.pets.find().find(p => p.id === id);
    },
    insert: (pet: Omit<Pet, 'id' | 'createdAt'>): Pet => {
      const all = db.pets.find();
      const newPet: Pet = {
        ...pet,
        id: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      all.unshift(newPet);
      saveCollection(STORAGE_KEYS.PETS, all);

      // Create default nutrition plan
      db.nutrition.insertDefault(newPet.id, newPet.name, newPet.type);

      realTimeBus.emit('pet_created', newPet);
      return newPet;
    },
    update: (id: string, updates: Partial<Pet>): Pet | null => {
      const all = db.pets.find();
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      saveCollection(STORAGE_KEYS.PETS, all);
      realTimeBus.emit('pet_updated', all[idx]);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.pets.find();
      const filtered = all.filter(p => p.id !== id);
      if (filtered.length === all.length) return false;
      saveCollection(STORAGE_KEYS.PETS, filtered);
      realTimeBus.emit('pet_deleted', id);
      return true;
    },
  },

  vaccinations: {
    find: (filter?: { petId?: string }): VaccinationRecord[] => {
      const all = loadCollection<VaccinationRecord>(STORAGE_KEYS.VACCINATIONS, INITIAL_VACCINATIONS);
      if (filter?.petId) {
        return all.filter(v => v.petId === filter.petId);
      }
      return all;
    },
    insert: (vac: Omit<VaccinationRecord, 'id'>): VaccinationRecord => {
      const all = db.vaccinations.find();
      const newVac: VaccinationRecord = {
        ...vac,
        id: `vac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      all.unshift(newVac);
      saveCollection(STORAGE_KEYS.VACCINATIONS, all);

      // Trigger automatic reminder notification
      db.notifications.insert({
        userId: 'usr_owner_1',
        targetRole: 'owner',
        title: 'Vaccination Recorded',
        message: `${newVac.vaccineName} logged for ${newVac.petName}. Next booster due: ${newVac.dueDate}`,
        type: 'vaccine',
        read: false,
        linkTab: 'health',
      });

      realTimeBus.emit('vaccine_added', newVac);
      return newVac;
    },
    update: (id: string, updates: Partial<VaccinationRecord>): VaccinationRecord | null => {
      const all = db.vaccinations.find();
      const idx = all.findIndex(v => v.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      saveCollection(STORAGE_KEYS.VACCINATIONS, all);
      realTimeBus.emit('vaccine_updated', all[idx]);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.vaccinations.find();
      const filtered = all.filter(v => v.id !== id);
      saveCollection(STORAGE_KEYS.VACCINATIONS, filtered);
      realTimeBus.emit('vaccine_deleted', id);
      return true;
    },
  },

  medications: {
    find: (filter?: { petId?: string }): Medication[] => {
      const all = loadCollection<Medication>(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
      if (filter?.petId) {
        return all.filter(m => m.petId === filter.petId);
      }
      return all;
    },
    insert: (med: Omit<Medication, 'id'>): Medication => {
      const all = db.medications.find();
      const newMed: Medication = {
        ...med,
        id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      all.unshift(newMed);
      saveCollection(STORAGE_KEYS.MEDICATIONS, all);

      db.notifications.insert({
        userId: 'usr_owner_1',
        targetRole: 'owner',
        title: 'Medication Schedule Active',
        message: `${newMed.name} (${newMed.dosage}) scheduled for ${newMed.petName}.`,
        type: 'medication',
        read: false,
        linkTab: 'health',
      });

      realTimeBus.emit('medication_added', newMed);
      return newMed;
    },
    update: (id: string, updates: Partial<Medication>): Medication | null => {
      const all = db.medications.find();
      const idx = all.findIndex(m => m.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      saveCollection(STORAGE_KEYS.MEDICATIONS, all);
      realTimeBus.emit('medication_updated', all[idx]);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.medications.find();
      const filtered = all.filter(m => m.id !== id);
      saveCollection(STORAGE_KEYS.MEDICATIONS, filtered);
      realTimeBus.emit('medication_deleted', id);
      return true;
    },
  },

  records: {
    find: (filter?: { petId?: string }): MedicalRecord[] => {
      const all = loadCollection<MedicalRecord>(STORAGE_KEYS.RECORDS, INITIAL_MEDICAL_RECORDS);
      if (filter?.petId) {
        return all.filter(r => r.petId === filter.petId);
      }
      return all;
    },
    insert: (rec: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord => {
      const all = db.records.find();
      const newRec: MedicalRecord = {
        ...rec,
        id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      all.unshift(newRec);
      saveCollection(STORAGE_KEYS.RECORDS, all);

      db.notifications.insert({
        userId: 'usr_owner_1',
        targetRole: 'owner',
        title: 'New Medical Record Added',
        message: `${newRec.type} record posted by ${newRec.vetName} for ${newRec.petName}.`,
        type: 'health_alert',
        read: false,
        linkTab: 'health',
      });

      realTimeBus.emit('record_added', newRec);
      return newRec;
    },
  },

  appointments: {
    find: (filter?: { ownerId?: string; vetId?: string }): Appointment[] => {
      const all = loadCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
      return all.filter(a => {
        if (filter?.ownerId && a.ownerId !== filter.ownerId) return false;
        if (filter?.vetId && a.vetId !== filter.vetId) return false;
        return true;
      });
    },
    findById: (id: string): Appointment | undefined => {
      return db.appointments.find().find(a => a.id === id);
    },
    insert: (apt: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
      const all = db.appointments.find();
      const newApt: Appointment = {
        ...apt,
        id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      all.unshift(newApt);
      saveCollection(STORAGE_KEYS.APPOINTMENTS, all);

      // Trigger notification for veterinarian & owner
      db.notifications.insert({
        userId: newApt.vetId,
        targetRole: 'vet',
        title: 'New Appointment Booking',
        message: `${newApt.ownerName} booked ${newApt.serviceType} for ${newApt.petName} on ${newApt.date} at ${newApt.timeSlot}.`,
        type: 'appointment',
        read: false,
        linkTab: 'appointments',
      });

      db.notifications.insert({
        userId: newApt.ownerId,
        targetRole: 'owner',
        title: 'Appointment Request Submitted',
        message: `Your appointment request for ${newApt.petName} with ${newApt.vetName} is currently ${newApt.status}.`,
        type: 'appointment',
        read: false,
        linkTab: 'appointments',
      });

      realTimeBus.emit('appointment_created', newApt);
      return newApt;
    },
    update: (id: string, updates: Partial<Appointment>): Appointment | null => {
      const all = db.appointments.find();
      const idx = all.findIndex(a => a.id === id);
      if (idx === -1) return null;
      const previousStatus = all[idx].status;
      all[idx] = { ...all[idx], ...updates };
      saveCollection(STORAGE_KEYS.APPOINTMENTS, all);

      if (updates.status && updates.status !== previousStatus) {
        db.notifications.insert({
          userId: all[idx].ownerId,
          targetRole: 'owner',
          title: `Appointment ${updates.status.toUpperCase()}`,
          message: `Appointment for ${all[idx].petName} with ${all[idx].vetName} on ${all[idx].date} is now ${updates.status}.`,
          type: 'appointment',
          read: false,
          linkTab: 'appointments',
        });
      }

      realTimeBus.emit('appointment_updated', all[idx]);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.appointments.find();
      const filtered = all.filter(a => a.id !== id);
      saveCollection(STORAGE_KEYS.APPOINTMENTS, filtered);
      realTimeBus.emit('appointment_deleted', id);
      return true;
    },
  },

  nutrition: {
    find: (filter?: { petId?: string }): NutritionPlan[] => {
      const all = loadCollection<NutritionPlan>(STORAGE_KEYS.NUTRITION, INITIAL_NUTRITION_PLANS);
      if (filter?.petId) {
        return all.filter(n => n.petId === filter.petId);
      }
      return all;
    },
    findByPetId: (petId: string): NutritionPlan | undefined => {
      return db.nutrition.find().find(n => n.petId === petId);
    },
    update: (id: string, updates: Partial<NutritionPlan>): NutritionPlan | null => {
      const all = db.nutrition.find();
      const idx = all.findIndex(n => n.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      saveCollection(STORAGE_KEYS.NUTRITION, all);
      realTimeBus.emit('nutrition_updated', all[idx]);
      return all[idx];
    },
    toggleMeal: (planId: string, mealId: string): NutritionPlan | null => {
      const plan = db.nutrition.find().find(p => p.id === planId);
      if (!plan) return null;
      const updatedMeals = plan.meals.map(m =>
        m.id === mealId ? { ...m, completedToday: !m.completedToday } : m
      );
      return db.nutrition.update(planId, { meals: updatedMeals });
    },
    insertDefault: (petId: string, petName: string, animalType: string): NutritionPlan => {
      const all = db.nutrition.find();
      const newPlan: NutritionPlan = {
        id: `nut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        petId,
        petName,
        foodType: animalType === 'Cat' ? 'Wet Food' : animalType === 'Rabbit' ? 'Custom Mix' : 'Dry Kibble',
        brand: animalType === 'Cat' ? 'Royal Canin Feline Health' : animalType === 'Rabbit' ? 'Oxbow Essentials' : 'Purina Pro Plan Adult',
        portionGrams: animalType === 'Dog' ? 320 : animalType === 'Cat' ? 160 : 40,
        frequencyTimesPerDay: 2,
        meals: [
          { id: 'm_am', time: '08:00 AM', title: 'Morning Meal', portion: 'Standard recommended portion', completedToday: false },
          { id: 'm_pm', time: '06:30 PM', title: 'Evening Meal', portion: 'Standard recommended portion', completedToday: false },
        ],
        calorieTargetKcal: animalType === 'Dog' ? 1200 : animalType === 'Cat' ? 220 : 150,
        allergies: [],
        dietaryGuidelines: [
          `Formulated for optimal ${animalType} metabolism and health`,
          'Ensure clean, fresh drinking water accessible at all times',
          'Measure portions carefully to maintain healthy body condition score',
        ],
        hydrationNotes: 'Monitor clean water intake daily',
        updatedAt: new Date().toISOString(),
      };
      all.push(newPlan);
      saveCollection(STORAGE_KEYS.NUTRITION, all);
      return newPlan;
    },
  },

  notifications: {
    find: (filter?: { userId?: string; targetRole?: string }): NotificationItem[] => {
      const all = loadCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      return all.filter(n => {
        if (filter?.userId && n.userId === filter.userId) return true;
        if (filter?.targetRole && (n.targetRole === 'all' || n.targetRole === filter.targetRole)) return true;
        return !filter?.userId && !filter?.targetRole;
      });
    },
    insert: (item: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem => {
      const all = loadCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const newNotif: NotificationItem = {
        ...item,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      all.unshift(newNotif);
      saveCollection(STORAGE_KEYS.NOTIFICATIONS, all);
      realTimeBus.emit('notification_received', newNotif);
      return newNotif;
    },
    markAsRead: (id: string): void => {
      const all = loadCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const idx = all.findIndex(n => n.id === id);
      if (idx !== -1) {
        all[idx].read = true;
        saveCollection(STORAGE_KEYS.NOTIFICATIONS, all);
        realTimeBus.emit('notification_read', id);
      }
    },
    markAllAsRead: (userId?: string): void => {
      const all = loadCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      all.forEach(n => {
        if (!userId || n.userId === userId || n.targetRole === 'all') {
          n.read = true;
        }
      });
      saveCollection(STORAGE_KEYS.NOTIFICATIONS, all);
      realTimeBus.emit('all_notifications_read', userId);
    },
    delete: (id: string): void => {
      const all = loadCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const filtered = all.filter(n => n.id !== id);
      saveCollection(STORAGE_KEYS.NOTIFICATIONS, filtered);
      realTimeBus.emit('notification_deleted', id);
    },
  },

  auth: {
    getCurrentUser: (): User | null => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!raw) {
          // Default to Emily Davis (Owner) for instant delightful zero-friction onboarding
          const defaultUser = INITIAL_USERS[0];
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
          localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, `jwt_mock_token_${defaultUser.id}`);
          return defaultUser;
        }
        return JSON.parse(raw);
      } catch {
        return INITIAL_USERS[0];
      }
    },
    login: (email: string, _password?: string): { user: User; token: string } => {
      const user = db.users.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password. Please try again.');
      }
      const token = `jwt_simulated_token_${user.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
      realTimeBus.emit('auth_state_changed', user);
      return { user, token };
    },
    loginAsRole: (role: 'owner' | 'vet' | 'admin'): { user: User; token: string } => {
      const user = db.users.find().find(u => u.role === role) || INITIAL_USERS[0];
      const token = `jwt_simulated_token_${user.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
      realTimeBus.emit('auth_state_changed', user);
      return { user, token };
    },
    register: (name: string, email: string, role: 'owner' | 'vet', extra?: { clinicName?: string; specialization?: string }): { user: User; token: string } => {
      const existing = db.users.findByEmail(email);
      if (existing) {
        throw new Error('An account with this email address already exists.');
      }
      const newUser = db.users.insert({
        name,
        email,
        role,
        phone: '+1 (555) 000-0000',
        status: role === 'vet' ? 'verified' : 'active',
        clinicName: extra?.clinicName,
        specialization: extra?.specialization,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
      });
      const token = `jwt_simulated_token_${newUser.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
      realTimeBus.emit('auth_state_changed', newUser);
      return { user: newUser, token };
    },
    logout: (): void => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
      realTimeBus.emit('auth_state_changed', null);
    },
  },

  // Reset demo data helper
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(INITIAL_PETS));
    localStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(INITIAL_VACCINATIONS));
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(INITIAL_MEDICATIONS));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(INITIAL_NUTRITION_PLANS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    realTimeBus.emit('data_reset');
  }
};
