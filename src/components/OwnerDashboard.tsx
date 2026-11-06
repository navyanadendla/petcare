import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Syringe,
  Pill,
  Plus,
  Stethoscope,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileText,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Search,
} from 'lucide-react';
import { Pet, VaccinationRecord, Medication, MedicalRecord, Appointment, User } from '../types';
import { PetCard } from './PetCard';

interface OwnerDashboardProps {
  pets: Pet[];
  vaccinations: VaccinationRecord[];
  medications: Medication[];
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  vets: User[];
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  onOpenAddPet: () => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  onViewPassport: (pet: Pet) => void;
  onOpenBookAppointment: (pet?: Pet) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (apt: Appointment) => void;
  onOpenAddVaccine: () => void;
  onOpenAddMedication: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  pets,
  vaccinations,
  medications,
  medicalRecords,
  appointments,
  vets,
  activeSubTab,
  onSubTabChange,
  onOpenAddPet,
  onEditPet,
  onDeletePet,
  onViewPassport,
  onOpenBookAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenAddVaccine,
  onOpenAddMedication,
}) => {
  const [selectedPetFilter, setSelectedPetFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered datasets
  const filteredPets = pets.filter(p => {
    if (selectedPetFilter !== 'all' && p.id !== selectedPetFilter) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.breed.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredVaccines = vaccinations.filter(v => {
    if (selectedPetFilter !== 'all' && v.petId !== selectedPetFilter) return false;
    return true;
  });

  const filteredMedications = medications.filter(m => {
    if (selectedPetFilter !== 'all' && m.petId !== selectedPetFilter) return false;
    return true;
  });

  const filteredRecords = medicalRecords.filter(r => {
    if (selectedPetFilter !== 'all' && r.petId !== selectedPetFilter) return false;
    return true;
  });

  const filteredAppointments = appointments.filter(a => {
    if (selectedPetFilter !== 'all' && a.petId !== selectedPetFilter) return false;
    return true;
  });

  // Calculate metrics
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const activeMeds = medications.filter(m => m.status === 'Active');
  const dueSoonVaccines = vaccinations.filter(v => v.status === 'Due Soon' || v.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards Strip (Strict mathematical rhythm, no cards within cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Registered Pets
            </span>
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {pets.length}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              {pets.map(p => p.name).join(', ') || 'No pets added yet'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Upcoming Visits
            </span>
            <span className="text-2xl font-bold text-sky-800 font-mono tabular-nums">
              {upcomingAppointments.length}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              {upcomingAppointments.length > 0 ? `Next: ${upcomingAppointments[0].date}` : 'No upcoming visits'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Active Medications
            </span>
            <span className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
              {activeMeds.length}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Daily wellness regimens
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Booster Alerts
            </span>
            <span className={`text-2xl font-bold font-mono tabular-nums ${dueSoonVaccines.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {dueSoonVaccines.length}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              {dueSoonVaccines.length > 0 ? 'Immunizations due soon' : 'All vaccines compliant'}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dueSoonVaccines.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
            <Syringe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedPetFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedPetFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Pets ({pets.length})
          </button>
          {pets.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPetFilter(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedPetFilter === p.id
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <img
                src={p.photoUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover"
              />
              {p.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddPet}
            className="flex-1 sm:flex-initial py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Pet
          </button>
          <button
            onClick={() => onOpenBookAppointment()}
            className="flex-1 sm:flex-initial py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Stethoscope className="w-4 h-4" />
            Book Vet
          </button>
        </div>
      </div>

      {/* Subtab Navigation (Overview, Pets, Health, Appointments) */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Urgent Vaccination & Medication Alerts */}
          {dueSoonVaccines.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Immunizations Requiring Attention
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {dueSoonVaccines.map(v => `${v.petName}: ${v.vaccineName} (Due ${v.dueDate})`).join(' · ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSubTabChange('health')}
                className="py-1.5 px-3 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition self-start sm:self-center whitespace-nowrap"
              >
                View Vaccine Schedule
              </button>
            </div>
          )}

          {/* Pets Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Registered Pets
                </h3>
                <p className="text-xs text-slate-500">
                  Manage pet profiles, passports, and wellness logs
                </p>
              </div>
              <button
                onClick={() => onSubTabChange('pets')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                View all ({pets.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onEdit={onEditPet}
                  onDelete={onDeletePet}
                  onViewPassport={onViewPassport}
                  onBookAppointment={() => onOpenBookAppointment(pet)}
                />
              ))}
            </div>
          </div>

          {/* Split 2-Column: Upcoming Appointments + Medication Routine */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Upcoming Veterinary Appointments
                </h3>
                <button
                  onClick={() => onOpenBookAppointment()}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  + Book
                </button>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No upcoming appointments booked. Click "+ Book" to schedule a consultation.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">{apt.petName}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-medium text-slate-600">{apt.serviceType}</span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-2 tabular-nums">
                          <span className="font-medium text-slate-700">{apt.date}</span>
                          <span>at</span>
                          <span className="font-medium text-slate-700">{apt.timeSlot}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-1">
                          With {apt.vetName} ({apt.clinicName})
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : apt.status === 'completed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {apt.status}
                        </span>

                        {apt.status === 'pending' || apt.status === 'confirmed' ? (
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => onRescheduleAppointment(apt)}
                              className="text-[11px] text-teal-700 hover:underline"
                            >
                              Reschedule
                            </button>
                            <span className="text-slate-300">·</span>
                            <button
                              onClick={() => onCancelAppointment(apt.id)}
                              className="text-[11px] text-rose-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Medication & Care Routine */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-amber-600" />
                  Active Medications & Supplements
                </h3>
                <button
                  onClick={onOpenAddMedication}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  + Add Medication
                </button>
              </div>

              {filteredMedications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active medications logged.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMedications.map(med => (
                    <div
                      key={med.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{med.name}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-teal-700 font-semibold">{med.petName}</span>
                        </div>
                        <p className="text-slate-600 font-medium">
                          {med.dosage} ({med.frequency})
                        </p>
                        <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">
                          {med.instructions}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        {med.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab: My Pets */}
      {activeSubTab === 'pets' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Registered Family Pets ({pets.length})
            </h3>
            <button
              onClick={onOpenAddPet}
              className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Register Pet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={onEditPet}
                onDelete={onDeletePet}
                onViewPassport={onViewPassport}
                onBookAppointment={() => onOpenBookAppointment(pet)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subtab: Health & Vaccines */}
      {activeSubTab === 'health' && (
        <div className="space-y-6">
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Health Records & Immunization Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Core vaccinations, veterinary clinical records, and prescription logs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddVaccine}
                className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Syringe className="w-4 h-4" />
                Record Vaccine
              </button>
              <button
                onClick={onOpenAddMedication}
                className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Pill className="w-4 h-4" />
                Add Medication
              </button>
            </div>
          </div>

          {/* Vaccination Schedule Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-teal-600" />
                Vaccination Schedule & Booster Tracking
              </h4>
              <span className="text-xs text-slate-500 tabular-nums">
                {filteredVaccines.length} records found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Pet</th>
                    <th className="px-5 py-3">Vaccine Name</th>
                    <th className="px-5 py-3">Date Administered</th>
                    <th className="px-5 py-3">Booster Due Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Batch / Vet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVaccines.map(vac => (
                    <tr key={vac.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {vac.petName}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {vac.vaccineName}
                        {vac.notes && <div className="text-[11px] text-slate-400 mt-0.5">{vac.notes}</div>}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600 tabular-nums">
                        {vac.dateAdministered}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold tabular-nums text-slate-900">
                        {vac.dueDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          vac.status === 'Up to date'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : vac.status === 'Due Soon'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {vac.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <span className="font-mono text-[11px] text-slate-700 block">{vac.batchNumber || 'N/A'}</span>
                        <span className="text-[11px] text-slate-400">{vac.vetName}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Encounters List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Veterinarian Medical Encounters & Diagnosis History
            </h4>

            {filteredRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No medical encounters logged yet.</p>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map(rec => (
                  <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/70 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rec.petName}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {rec.type}
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono tabular-nums">
                        {rec.date} · {rec.vetName} ({rec.clinicName})
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">Diagnosis:</span>
                      <p className="text-slate-800 leading-relaxed">{rec.diagnosis}</p>
                    </div>

                    {rec.treatment && (
                      <div>
                        <span className="font-semibold text-slate-700 block mb-0.5">Procedures & Treatment:</span>
                        <p className="text-slate-800">{rec.treatment}</p>
                      </div>
                    )}

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="font-semibold text-amber-800">Prescriptions:</span>
                        <span className="text-slate-700">{rec.prescriptions.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab: Appointments */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Veterinary Appointments & Scheduling
              </h3>
              <p className="text-xs text-slate-500">
                Book checkups, track confirmation status, or reschedule visits
              </p>
            </div>
            <button
              onClick={() => onOpenBookAppointment()}
              className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Book Appointment
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Pet</th>
                    <th className="px-5 py-3">Service Type</th>
                    <th className="px-5 py-3">Doctor & Clinic</th>
                    <th className="px-5 py-3">Date & Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        No appointments found. Click "Book Appointment" to schedule one.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 text-sm block">{apt.petName}</span>
                          <span className="text-[11px] text-slate-400">{apt.petType}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800">{apt.serviceType}</span>
                          {apt.notes && <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{apt.notes}</div>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-slate-900 block">{apt.vetName}</span>
                          <span className="text-[11px] text-slate-400">{apt.clinicName}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono tabular-nums">
                          <div className="font-semibold text-slate-800">{apt.date}</div>
                          <div className="text-slate-500 text-[11px]">{apt.timeSlot}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : apt.status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : apt.status === 'completed'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {apt.status === 'pending' || apt.status === 'confirmed' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onRescheduleAppointment(apt)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-xs transition"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => onCancelAppointment(apt.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-medium text-xs transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Archived</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
