import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Stethoscope, Heart, AlertCircle, Building2 } from 'lucide-react';
import { Pet, User, Appointment, AnimalType } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => void;
  pets: Pet[];
  vets: User[];
  currentUserId: string;
  currentUserName: string;
  defaultPetId?: string;
  appointmentToEdit?: Appointment | null;
}

const SERVICE_TYPES: Appointment['serviceType'][] = [
  'General Checkup',
  'Vaccination',
  'Dental Care',
  'Surgery Consult',
  'Nutritional Advice',
  'Emergency',
];

const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '01:30 PM',
  '02:15 PM',
  '03:00 PM',
  '03:45 PM',
  '04:30 PM',
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onBook,
  pets,
  vets,
  currentUserId,
  currentUserName,
  defaultPetId,
  appointmentToEdit,
}) => {
  const [selectedPetId, setSelectedPetId] = useState(defaultPetId || pets[0]?.id || '');
  const [selectedVetId, setSelectedVetId] = useState(vets[0]?.id || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [serviceType, setServiceType] = useState<Appointment['serviceType']>('General Checkup');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentToEdit) {
      setSelectedPetId(appointmentToEdit.petId);
      setSelectedVetId(appointmentToEdit.vetId);
      setDate(appointmentToEdit.date);
      setTimeSlot(appointmentToEdit.timeSlot);
      setServiceType(appointmentToEdit.serviceType);
      setNotes(appointmentToEdit.notes || '');
    } else if (defaultPetId) {
      setSelectedPetId(defaultPetId);
    }
  }, [appointmentToEdit, defaultPetId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pet = pets.find(p => p.id === selectedPetId);
    if (!pet) {
      setError('Please select which pet this appointment is for.');
      return;
    }

    const vet = vets.find(v => v.id === selectedVetId);
    if (!vet) {
      setError('Please choose an attending veterinarian.');
      return;
    }

    if (!date) {
      setError('Please choose an appointment date.');
      return;
    }

    onBook({
      petId: pet.id,
      petName: pet.name,
      petType: pet.type,
      ownerId: currentUserId,
      ownerName: currentUserName,
      vetId: vet.id,
      vetName: vet.name,
      clinicName: vet.clinicName || 'City Animal Health Center',
      date,
      timeSlot,
      serviceType,
      notes: notes.trim() || undefined,
      status: appointmentToEdit ? appointmentToEdit.status : 'pending',
    });

    onClose();
  };

  // Filter verified vets
  const activeVets = vets.filter(v => v.role === 'vet');
  const selectedVet = activeVets.find(v => v.id === selectedVetId) || activeVets[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {appointmentToEdit ? 'Reschedule Appointment' : 'Book Veterinary Appointment'}
              </h3>
              <p className="text-xs text-slate-500">
                Select your pet, preferred veterinary specialist and convenient time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Select Pet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Pet *
            </label>
            {pets.length === 0 ? (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                No registered pets found. Please register a pet first.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPetId(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      selectedPetId === p.id
                        ? 'border-teal-600 bg-teal-50/80 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.type} · {p.breed}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Veterinarian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attending Veterinarian *
            </label>
            <div className="space-y-2">
              {activeVets.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVetId(v.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    selectedVetId === v.id
                      ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vet'}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{v.name}</h4>
                      <p className="text-[11px] text-teal-700 font-medium">
                        {v.specialization || 'General Practice'}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {v.clinicName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service / Reason for Visit *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SERVICE_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition text-center truncate ${
                    serviceType === type
                      ? 'border-teal-600 bg-teal-600 text-white font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
              >
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Symptoms, Specific Concerns, or Notes for Doctor
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Annual booster shots due, slight scratching near right ear..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
            >
              {appointmentToEdit ? 'Update Booking' : 'Confirm & Request Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
