import React, { useState } from 'react';
import { X, Pill, Clock } from 'lucide-react';
import { Pet, Medication } from '../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: Omit<Medication, 'id'>) => void;
  pets: Pet[];
  defaultPetId?: string;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  defaultPetId,
}) => {
  const [petId, setPetId] = useState(defaultPetId || pets[0]?.id || '');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 tablet (10mg)');
  const [frequency, setFrequency] = useState('Once daily in the morning');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [instructions, setInstructions] = useState('Administer with food. Complete entire course.');
  const [prescribedBy, setPrescribedBy] = useState('Dr. Sarah Jenkins, DVM');

  if (!isOpen) return null;

  const currentPet = pets.find(p => p.id === petId) || pets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet || !name.trim()) return;

    onSave({
      petId: currentPet.id,
      petName: currentPet.name,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      startDate,
      endDate,
      instructions: instructions.trim(),
      prescribedBy: prescribedBy.trim(),
      status: 'Active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Pet Medication</h3>
              <p className="text-xs text-slate-500">Track dosage, dosing frequency, and refill dates</p>
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
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              {pets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type} - {p.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Amoxicillin, Simparica Trio, Prednisone"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage *</label>
              <input
                type="text"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 1 tablet, 5 ml, 2 drops"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency *</label>
              <input
                type="text"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                placeholder="e.g. Twice daily with meals"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End / Review Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 tabular-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prescribing Doctor</label>
            <input
              type="text"
              value={prescribedBy}
              onChange={e => setPrescribedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Special Administration Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Give with a spoonful of peanut butter or wet food..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
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
              className="py-2 px-5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition"
            >
              Save Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
