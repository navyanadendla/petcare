import React, { useState } from 'react';
import { X, Syringe, Calendar, ShieldCheck } from 'lucide-react';
import { Pet, VaccinationRecord } from '../types';

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<VaccinationRecord, 'id'>) => void;
  pets: Pet[];
  defaultPetId?: string;
  defaultVetName?: string;
  defaultVetId?: string;
}

const COMMON_VACCINES: Record<string, string[]> = {
  Dog: [
    'Rabies 3-Year Vaccine',
    'DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)',
    'Bordetella (Kennel Cough)',
    'Leptospirosis 4-Way',
    'Lyme Disease Vaccine',
    'Canine Influenza (H3N2 / H3N8)',
  ],
  Cat: [
    'Rabies 1-Year / 3-Year Vaccine',
    'FVRCP (Feline Viral Rhinotracheitis, Calici, Panleukopenia)',
    'Feline Leukemia Virus (FeLV)',
    'FIV Immunization',
  ],
  Rabbit: [
    'RHDV2 (Rabbit Hemorrhagic Disease Virus 2)',
    'Myxomatosis Vaccine',
  ],
  Other: [
    'Core Species Immunization',
    'Avian Polyomavirus Vaccine',
    'Annual Booster Injection',
  ],
};

export const AddVaccineModal: React.FC<AddVaccineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  defaultPetId,
  defaultVetName = 'Dr. Sarah Jenkins, DVM',
  defaultVetId = 'usr_vet_1',
}) => {
  const [petId, setPetId] = useState(defaultPetId || pets[0]?.id || '');
  const [vaccineName, setVaccineName] = useState('Rabies 3-Year Vaccine');
  const [dateAdministered, setDateAdministered] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [batchNumber, setBatchNumber] = useState('VAC-' + Math.floor(10000 + Math.random() * 90000));
  const [vetName, setVetName] = useState(defaultVetName);
  const [notes, setNotes] = useState('Administered subcutaneously. Patient exhibited normal tolerance.');
  const [status, setStatus] = useState<VaccinationRecord['status']>('Up to date');

  if (!isOpen) return null;

  const currentPet = pets.find(p => p.id === petId) || pets[0];
  const recommendedList = currentPet ? (COMMON_VACCINES[currentPet.type] || COMMON_VACCINES.Other) : COMMON_VACCINES.Dog;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet) return;

    onSave({
      petId: currentPet.id,
      petName: currentPet.name,
      vaccineName,
      dateAdministered,
      dueDate,
      status,
      batchNumber,
      vetName,
      vetId: defaultVetId,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Vaccination</h3>
              <p className="text-xs text-slate-500">Log immunizations, booster dates, and lot numbers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Pet *</label>
            <select
              value={petId}
              onChange={e => setPetId(e.target.value)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccine Name *</label>
            <input
              type="text"
              value={vaccineName}
              onChange={e => setVaccineName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 mb-2"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {recommendedList.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVaccineName(v)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition ${
                    vaccineName === v ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date Administered *</label>
              <input
                type="date"
                value={dateAdministered}
                onChange={e => setDateAdministered(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Next Booster Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lot / Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
                placeholder="VAC-88219"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccination Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as VaccinationRecord['status'])}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="Up to date">Up to date (Compliant)</option>
                <option value="Due Soon">Due Soon (Within 30 Days)</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Administering Veterinarian</label>
            <input
              type="text"
              value={vetName}
              onChange={e => setVetName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes & Observation</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
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
              Save Vaccination Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
