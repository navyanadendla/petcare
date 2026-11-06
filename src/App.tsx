import React, { useState, useEffect, useCallback } from 'react';
import { db, realTimeBus } from './services/storage';
import {
  User,
  UserRole,
  Pet,
  VaccinationRecord,
  Medication,
  MedicalRecord,
  Appointment,
  NutritionPlan,
  NotificationItem,
} from './types';

import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { VetDashboard } from './components/VetDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NutritionView } from './components/NutritionView';
import { LandingHero } from './components/LandingHero';
import { PetModal } from './components/PetModal';
import { PetHealthPassportModal } from './components/PetHealthPassportModal';
import { AppointmentModal } from './components/AppointmentModal';
import { AddVaccineModal } from './components/AddVaccineModal';
import { AddMedicationModal } from './components/AddMedicationModal';
import { AddMedicalRecordModal } from './components/AddMedicalRecordModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.auth.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Database Collections State
  const [users, setUsers] = useState<User[]>(() => db.users.find());
  const [pets, setPets] = useState<Pet[]>(() => db.pets.find());
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => db.vaccinations.find());
  const [medications, setMedications] = useState<Medication[]>(() => db.medications.find());
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => db.records.find());
  const [appointments, setAppointments] = useState<Appointment[]>(() => db.appointments.find());
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(() => db.nutrition.find());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => db.notifications.find());

  // Real-time Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals State
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' | 'forgot' }>({
    isOpen: false,
    mode: 'login',
  });
  const [petModal, setPetModal] = useState<{ isOpen: boolean; petToEdit: Pet | null }>({
    isOpen: false,
    petToEdit: null,
  });
  const [passportModal, setPassportModal] = useState<{ isOpen: boolean; pet: Pet | null }>({
    isOpen: false,
    pet: null,
  });
  const [appointmentModal, setAppointmentModal] = useState<{
    isOpen: boolean;
    appointmentToEdit: Appointment | null;
    defaultPetId?: string;
  }>({
    isOpen: false,
    appointmentToEdit: null,
  });
  const [vaccineModal, setVaccineModal] = useState<{ isOpen: boolean; defaultPetId?: string }>({
    isOpen: false,
  });
  const [medicationModal, setMedicationModal] = useState<{ isOpen: boolean; defaultPetId?: string }>({
    isOpen: false,
  });
  const [recordModal, setRecordModal] = useState<{
    isOpen: boolean;
    associatedAppointment: Appointment | null;
  }>({
    isOpen: false,
    associatedAppointment: null,
  });

  // Reload collections helper
  const reloadData = useCallback(() => {
    setUsers(db.users.find());
    setPets(db.pets.find());
    setVaccinations(db.vaccinations.find());
    setMedications(db.medications.find());
    setMedicalRecords(db.records.find());
    setAppointments(db.appointments.find());
    setNutritionPlans(db.nutrition.find());
    setNotifications(db.notifications.find());
  }, []);

  // Subscribe to real-time bus events
  useEffect(() => {
    const handlePetCreated = (pet: Pet) => {
      reloadData();
      addToast('New Pet Registered', `${pet.name} has been added to your care profile.`);
    };
    const handlePetUpdated = (pet: Pet) => {
      reloadData();
      addToast('Profile Updated', `${pet.name}'s details have been saved.`);
    };
    const handlePetDeleted = () => {
      reloadData();
      addToast('Pet Removed', 'Pet profile was removed from records.', 'info');
    };
    const handleAppointmentCreated = (apt: Appointment) => {
      reloadData();
      addToast('Appointment Booked', `Consultation for ${apt.petName} with ${apt.vetName} scheduled for ${apt.date}.`);
    };
    const handleAppointmentUpdated = (apt: Appointment) => {
      reloadData();
      addToast('Appointment Updated', `Status for ${apt.petName}'s appointment is now ${apt.status.toUpperCase()}.`, 'info');
    };
    const handleVaccineAdded = (vac: VaccinationRecord) => {
      reloadData();
      addToast('Vaccination Logged', `${vac.vaccineName} recorded for ${vac.petName}.`);
    };
    const handleMedicationAdded = (med: Medication) => {
      reloadData();
      addToast('Medication Added', `${med.name} added to ${med.petName}'s schedule.`);
    };
    const handleNotificationReceived = (notif: NotificationItem) => {
      reloadData();
      addToast(notif.title, notif.message, 'info');
    };
    const handleAuthChange = (user: User | null) => {
      setCurrentUser(user);
      reloadData();
      if (user) {
        addToast('Signed In', `Welcome back, ${user.name}!`);
      }
    };
    const handleDataReset = () => {
      reloadData();
      addToast('Database Reset', 'Demo database restored to default seed state.', 'info');
    };

    realTimeBus.on('pet_created', handlePetCreated);
    realTimeBus.on('pet_updated', handlePetUpdated);
    realTimeBus.on('pet_deleted', handlePetDeleted);
    realTimeBus.on('appointment_created', handleAppointmentCreated);
    realTimeBus.on('appointment_updated', handleAppointmentUpdated);
    realTimeBus.on('vaccine_added', handleVaccineAdded);
    realTimeBus.on('medication_added', handleMedicationAdded);
    realTimeBus.on('notification_received', handleNotificationReceived);
    realTimeBus.on('auth_state_changed', handleAuthChange);
    realTimeBus.on('data_reset', handleDataReset);

    return () => {
      realTimeBus.off('pet_created', handlePetCreated);
      realTimeBus.off('pet_updated', handlePetUpdated);
      realTimeBus.off('pet_deleted', handlePetDeleted);
      realTimeBus.off('appointment_created', handleAppointmentCreated);
      realTimeBus.off('appointment_updated', handleAppointmentUpdated);
      realTimeBus.off('vaccine_added', handleVaccineAdded);
      realTimeBus.off('medication_added', handleMedicationAdded);
      realTimeBus.off('notification_received', handleNotificationReceived);
      realTimeBus.off('auth_state_changed', handleAuthChange);
      realTimeBus.off('data_reset', handleDataReset);
    };
  }, [addToast, reloadData]);

  // Handle Role Switch
  const handleSwitchRole = (role: UserRole) => {
    const { user } = db.auth.loginAsRole(role);
    setCurrentUser(user);
    setActiveTab('overview');
    addToast('Role Switched', `Now viewing as ${role === 'owner' ? 'Pet Owner' : role === 'vet' ? 'Veterinarian' : 'Administrator'}.`, 'info');
  };

  // Pet Handlers
  const handleSavePet = (petData: Partial<Pet>) => {
    if (petModal.petToEdit) {
      db.pets.update(petModal.petToEdit.id, petData);
    } else {
      db.pets.insert(petData as Omit<Pet, 'id' | 'createdAt'>);
    }
    reloadData();
  };

  const handleDeletePet = (id: string) => {
    const pet = pets.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete ${pet?.name || 'this pet'}?`)) {
      db.pets.delete(id);
      reloadData();
    }
  };

  // Appointment Handlers
  const handleBookAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (appointmentModal.appointmentToEdit) {
      db.appointments.update(appointmentModal.appointmentToEdit.id, data);
    } else {
      db.appointments.insert(data);
    }
    reloadData();
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      db.appointments.update(id, { status: 'cancelled' });
      reloadData();
    }
  };

  const handleConfirmAppointment = (id: string) => {
    db.appointments.update(id, { status: 'confirmed' });
    reloadData();
  };

  const handleCompleteConsult = (recordData: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    db.records.insert(recordData);
    if (recordModal.associatedAppointment) {
      db.appointments.update(recordModal.associatedAppointment.id, {
        status: 'completed',
        diagnosisSummary: recordData.diagnosis,
        prescriptionSummary: recordData.prescriptions?.join(', '),
      });
    }
    reloadData();
    addToast('Clinical Visit Completed', `Medical encounter filed for ${recordData.petName}.`);
  };

  // Vaccination & Medication Handlers
  const handleSaveVaccine = (record: Omit<VaccinationRecord, 'id'>) => {
    db.vaccinations.insert(record);
    reloadData();
  };

  const handleSaveMedication = (med: Omit<Medication, 'id'>) => {
    db.medications.insert(med);
    reloadData();
  };

  // Nutrition Handlers
  const handleToggleMeal = (planId: string, mealId: string) => {
    db.nutrition.toggleMeal(planId, mealId);
    reloadData();
  };

  const handleUpdatePlan = (planId: string, updates: Partial<NutritionPlan>) => {
    db.nutrition.update(planId, updates);
    reloadData();
    addToast('Nutrition Plan Saved', 'Dietary guidelines and meal portions updated.');
  };

  // Admin Handlers
  const handleToggleVetVerification = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === 'verified' ? 'pending' : 'verified';
    db.users.update(userId, { status: nextStatus });
    reloadData();
    addToast('Verification Updated', `${user.name} is now marked as ${nextStatus}.`, 'info');
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`Remove user ${user?.name}?`)) {
      const all = users.filter(u => u.id !== userId);
      localStorage.setItem('petcare_mongodb_users', JSON.stringify(all));
      reloadData();
      addToast('User Removed', 'Account was deleted from database.', 'info');
    }
  };

  const handleBroadcastNotification = (title: string, message: string, targetRole: 'all' | 'owner' | 'vet') => {
    db.notifications.insert({
      userId: 'system_broadcast',
      targetRole,
      title,
      message,
      type: 'system',
      read: false,
    });
    reloadData();
  };

  // Notification read/delete
  const handleMarkRead = (id: string) => {
    db.notifications.markAsRead(id);
    reloadData();
  };

  const handleMarkAllRead = () => {
    db.notifications.markAllAsRead(currentUser?.id);
    reloadData();
  };

  const handleDeleteNotif = (id: string) => {
    db.notifications.delete(id);
    reloadData();
  };

  // Filter user notifications
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (n.userId === currentUser.id) return true;
    if (n.targetRole === 'all') return true;
    if (n.targetRole === currentUser.role) return true;
    return false;
  });

  const unreadNotifCount = userNotifications.filter(n => !n.read).length;

  // Filter pets for current user if owner
  const currentOwnerPets = currentUser?.role === 'owner'
    ? pets.filter(p => p.ownerId === currentUser.id)
    : pets;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notifications={userNotifications}
        unreadCount={unreadNotifCount}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onDeleteNotif={handleDeleteNotif}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={(mode = 'login') => setAuthModal({ isOpen: true, mode })}
        onLogout={() => {
          db.auth.logout();
          setCurrentUser(null);
          addToast('Signed Out', 'You have been logged out.');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          /* Unauthenticated Landing Experience */
          <LandingHero
            onOpenAuth={(mode = 'register') => setAuthModal({ isOpen: true, mode })}
            onQuickDemo={handleSwitchRole}
          />
        ) : currentUser.role === 'owner' ? (
          /* Pet Owner View */
          activeTab === 'nutrition' ? (
            <NutritionView
              pets={currentOwnerPets}
              nutritionPlans={nutritionPlans}
              onToggleMeal={handleToggleMeal}
              onUpdatePlan={handleUpdatePlan}
            />
          ) : (
            <OwnerDashboard
              pets={currentOwnerPets}
              vaccinations={vaccinations}
              medications={medications}
              medicalRecords={medicalRecords}
              appointments={appointments}
              vets={users.filter(u => u.role === 'vet')}
              activeSubTab={activeTab}
              onSubTabChange={setActiveTab}
              onOpenAddPet={() => setPetModal({ isOpen: true, petToEdit: null })}
              onEditPet={pet => setPetModal({ isOpen: true, petToEdit: pet })}
              onDeletePet={handleDeletePet}
              onViewPassport={pet => setPassportModal({ isOpen: true, pet })}
              onOpenBookAppointment={pet =>
                setAppointmentModal({
                  isOpen: true,
                  appointmentToEdit: null,
                  defaultPetId: pet?.id,
                })
              }
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={apt =>
                setAppointmentModal({
                  isOpen: true,
                  appointmentToEdit: apt,
                })
              }
              onOpenAddVaccine={() => setVaccineModal({ isOpen: true })}
              onOpenAddMedication={() => setMedicationModal({ isOpen: true })}
            />
          )
        ) : currentUser.role === 'vet' ? (
          /* Veterinarian View */
          <VetDashboard
            vetUser={currentUser}
            appointments={appointments}
            pets={pets}
            medicalRecords={medicalRecords}
            vaccinations={vaccinations}
            onConfirmAppointment={handleConfirmAppointment}
            onCancelAppointment={handleCancelAppointment}
            onOpenCompleteConsult={apt =>
              setRecordModal({
                isOpen: true,
                associatedAppointment: apt,
              })
            }
            onOpenAddVaccine={() => setVaccineModal({ isOpen: true })}
            onOpenAddRecord={() =>
              setRecordModal({
                isOpen: true,
                associatedAppointment: null,
              })
            }
          />
        ) : (
          /* Administrator View */
          <AdminDashboard
            users={users}
            pets={pets}
            appointments={appointments}
            vaccinations={vaccinations}
            onToggleVetVerification={handleToggleVetVerification}
            onDeleteUser={handleDeleteUser}
            onDeletePet={handleDeletePet}
            onBroadcastNotification={handleBroadcastNotification}
            onResetDatabase={() => db.resetToDefaults()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PetCare Pulse</span>
            <span>·</span>
            <span>Comprehensive Pet Care Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Vaccinations & Boosters</span>
            <span>·</span>
            <span>Clinical Records</span>
            <span>·</span>
            <span>MongoDB Schema Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={user => {
          setCurrentUser(user);
          setActiveTab('overview');
        }}
        initialMode={authModal.mode}
      />

      <PetModal
        isOpen={petModal.isOpen}
        onClose={() => setPetModal({ isOpen: false, petToEdit: null })}
        onSave={handleSavePet}
        petToEdit={petModal.petToEdit}
        ownerId={currentUser?.id || 'usr_owner_1'}
        ownerName={currentUser?.name || 'Emily Davis'}
      />

      <PetHealthPassportModal
        pet={passportModal.pet}
        vaccinations={vaccinations}
        medications={medications}
        records={medicalRecords}
        isOpen={passportModal.isOpen}
        onClose={() => setPassportModal({ isOpen: false, pet: null })}
      />

      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={() => setAppointmentModal({ isOpen: false, appointmentToEdit: null })}
        onBook={handleBookAppointment}
        pets={currentOwnerPets}
        vets={users.filter(u => u.role === 'vet')}
        currentUserId={currentUser?.id || 'usr_owner_1'}
        currentUserName={currentUser?.name || 'Emily Davis'}
        defaultPetId={appointmentModal.defaultPetId}
        appointmentToEdit={appointmentModal.appointmentToEdit}
      />

      <AddVaccineModal
        isOpen={vaccineModal.isOpen}
        onClose={() => setVaccineModal({ isOpen: false })}
        onSave={handleSaveVaccine}
        pets={currentOwnerPets}
        defaultPetId={vaccineModal.defaultPetId}
      />

      <AddMedicationModal
        isOpen={medicationModal.isOpen}
        onClose={() => setMedicationModal({ isOpen: false })}
        onSave={handleSaveMedication}
        pets={currentOwnerPets}
        defaultPetId={medicationModal.defaultPetId}
      />

      <AddMedicalRecordModal
        isOpen={recordModal.isOpen}
        onClose={() => setRecordModal({ isOpen: false, associatedAppointment: null })}
        onSave={handleCompleteConsult}
        pets={pets}
        vetName={currentUser?.name || 'Dr. Sarah Jenkins, DVM'}
        vetId={currentUser?.id || 'usr_vet_1'}
        clinicName={currentUser?.clinicName || 'City Animal Health & Wellness'}
        associatedAppointment={recordModal.associatedAppointment}
      />

      {/* Real-time Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
