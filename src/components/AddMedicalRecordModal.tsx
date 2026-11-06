import React, { useState } from 'react';
import { X, FileText, Stethoscope, Thermometer, Weight, Plus } from 'lucide-react';
import { Pet, MedicalRecord, Appointment } from '../types';

interface AddMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => void;
  pets: Pet[];
  vetName: string;
  vetId: string;
  clinicName?: string;
  associatedAppointment?: Appointment | null;
}

export const AddMedicalRecordModal: React.FC<AddMedicalRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  vetName,
  vetId,
  clinicName = 'City Animal Health & Wellness',
  associatedAppointment,
}) => {
  const [petId, setPetId] = useState(associatedAppointment?.petId || pets[0]?.id || '');
  const [type, setType] = useState<MedicalRecord['type']>('General Checkup');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [temperature, setTemperature] = useState('101.4 °F');
  const [weight, setWeight] = useState(associatedAppointment ? (pets.find(p => p.id === associatedAppointment.petId)?.weightKg || 15.0) : 15.0);
  const [notes, setNotes] = useState('');
  const [prescriptionsText, setPrescriptionsText] = useState('');

  if (!isOpen) return null;

  const currentPet = pets.find(p => p.id === petId) || pets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet || !diagnosis.trim()) return;

    const prescriptions = prescriptionsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      petId: currentPet.id,
      petName: currentPet.name,
      vetId,
      vetName,
      clinicName,
      date: new Date().toISOString().split('T')[0],
      type,
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      temperature: temperature.trim() || undefined,
      weight: Number(weight),
      notes: notes.trim() || undefined,
      prescriptions: prescriptions.length > 0 ? prescriptions : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {associatedAppointment ? `Complete Consultation for ${associatedAppointment.petName}` : 'Add Clinical Medical Record'}
              </h3>
              <p className="text-xs text-slate-500">Record veterinary diagnosis, vitals, treatments, and prescriptions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient (Pet) *</label>
              <select
                value={petId}
                onChange={e => {
                  const pid = e.target.value;
                  setPetId(pid);
                  const p = pets.find(pet => pet.id === pid);
                  if (p) setWeight(p.weightKg);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {pets.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type} - {p.breed})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Encounter Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as MedicalRecord['type'])}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="General Checkup">General Wellness Checkup</option>
                <option value="Vaccination">Vaccination & Booster</option>
                <option value="Dental Care">Dental Scaling & Cleaning</option>
                <option value="Surgery">Surgical Procedure</option>
                <option value="Diagnostic">Diagnostic Imaging / Labwork</option>
                <option value="Emergency">Urgent Care Encounter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Temperature
              </label>
              <input
                type="text"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                placeholder="e.g. 101.5 °F (38.6 °C)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recorded Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Physical exam normal. Clear lungs, heart rate 90bpm. Mild tartar on molars..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Treatment & Procedures Rendered</label>
            <textarea
              rows={2}
              value={treatment}
              onChange={e => setTreatment(e.target.value)}
              placeholder="e.g. Core DHPP vaccination administered subcutaneously right shoulder. Nails trimmed."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prescriptions & Medications (comma-separated)
            </label>
            <input
              type="text"
              value={prescriptionsText}
              onChange={e => setPrescriptionsText(e.target.value)}
              placeholder="e.g. Simparica Trio 1 chew monthly, Dasuquin Joint Chews"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Discharge Notes & Follow-up</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Recommendations for diet, exercise, and next checkup date..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

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
              Sign & Save Clinical Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
