import React, { useState, useEffect } from 'react';
import { X, Heart, Upload, Camera, Check } from 'lucide-react';
import { Pet, AnimalType } from '../types';
import { DOG_IMAGE, CAT_IMAGE, RABBIT_IMAGE } from '../data/seedData';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Partial<Pet>) => void;
  petToEdit?: Pet | null;
  ownerId: string;
  ownerName: string;
}

const PRESET_PHOTOS = [
  { label: 'Golden Retriever', url: DOG_IMAGE, type: 'Dog' },
  { label: 'Tabby Cat', url: CAT_IMAGE, type: 'Cat' },
  { label: 'Lop Rabbit', url: RABBIT_IMAGE, type: 'Rabbit' },
];

export const PetModal: React.FC<PetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  petToEdit,
  ownerId,
  ownerName,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AnimalType>('Dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(2);
  const [ageMonths, setAgeMonths] = useState(0);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [weightKg, setWeightKg] = useState(15.0);
  const [color, setColor] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [photoUrl, setPhotoUrl] = useState(DOG_IMAGE);
  const [allergies, setAllergies] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [medicalHistorySummary, setMedicalHistorySummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name);
      setType(petToEdit.type);
      setBreed(petToEdit.breed);
      setAgeYears(petToEdit.ageYears);
      setAgeMonths(petToEdit.ageMonths);
      setGender(petToEdit.gender);
      setWeightKg(petToEdit.weightKg);
      setColor(petToEdit.color);
      setMicrochipId(petToEdit.microchipId || '');
      setPhotoUrl(petToEdit.photoUrl || DOG_IMAGE);
      setAllergies(petToEdit.allergies || '');
      setSpecialNeeds(petToEdit.specialNeeds || '');
      setMedicalHistorySummary(petToEdit.medicalHistorySummary || '');
    } else {
      setName('');
      setType('Dog');
      setBreed('');
      setAgeYears(2);
      setAgeMonths(0);
      setGender('Male');
      setWeightKg(15.0);
      setColor('');
      setMicrochipId('');
      setPhotoUrl(DOG_IMAGE);
      setAllergies('');
      setSpecialNeeds('');
      setMedicalHistorySummary('');
    }
  }, [petToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your pet\'s name.');
      return;
    }
    if (!breed.trim()) {
      setError('Please specify the breed.');
      return;
    }

    onSave({
      name: name.trim(),
      type,
      breed: breed.trim(),
      ageYears: Number(ageYears),
      ageMonths: Number(ageMonths),
      gender,
      weightKg: Number(weightKg),
      color: color.trim() || 'Standard',
      microchipId: microchipId.trim() || undefined,
      photoUrl,
      allergies: allergies.trim() || undefined,
      specialNeeds: specialNeeds.trim() || undefined,
      medicalHistorySummary: medicalHistorySummary.trim() || undefined,
      ownerId,
      ownerName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {petToEdit ? `Edit ${petToEdit.name}'s Profile` : 'Register a New Pet'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive profile for health records, vaccinations, and veterinary care
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Photo Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pet Avatar / Photograph
            </label>
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="Selected"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
              />
              <div className="flex-1">
                <span className="text-[11px] text-slate-500 block mb-1">
                  Choose a preset or enter photo URL:
                </span>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_PHOTOS.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(p.url);
                        if (p.type && !petToEdit) setType(p.type as AnimalType);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        photoUrl === p.url
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pet Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Buddy, Luna"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Animal Species *
              </label>
              <select
                value={type}
                onChange={e => {
                  const newType = e.target.value as AnimalType;
                  setType(newType);
                  if (newType === 'Dog') setPhotoUrl(DOG_IMAGE);
                  else if (newType === 'Cat') setPhotoUrl(CAT_IMAGE);
                  else if (newType === 'Rabbit') setPhotoUrl(RABBIT_IMAGE);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
                <option value="Rabbit">Rabbit (Lagomorph)</option>
                <option value="Bird">Bird (Avian)</option>
                <option value="Other">Other Companion Animal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Breed *
              </label>
              <input
                type="text"
                value={breed}
                onChange={e => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever, Siamese, Mix"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    gender === 'Male'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    gender === 'Female'
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  value={ageYears}
                  onChange={e => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Months
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={e => setAgeMonths(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={weightKg}
                onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 tabular-nums"
                required
              />
            </div>
          </div>

          {/* Microchip & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Microchip ID Number (15 Digits)
              </label>
              <input
                type="text"
                value={microchipId}
                onChange={e => setMicrochipId(e.target.value)}
                placeholder="e.g. 985141002348912"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coat Color / Markings
              </label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="e.g. Honey Golden, Black & White"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Health & Medical History */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Known Allergies or Sensitivities
              </label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder="e.g. Chicken protein, Penicillin, Dust mites"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Care Instructions & Routine Needs
              </label>
              <input
                type="text"
                value={specialNeeds}
                onChange={e => setSpecialNeeds(e.target.value)}
                placeholder="e.g. Joint supplement with breakfast, gentle handling"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medical History & Surgical Background
              </label>
              <textarea
                rows={2}
                value={medicalHistorySummary}
                onChange={e => setMedicalHistorySummary(e.target.value)}
                placeholder="Past surgeries, chronic conditions, spay/neuter history, dental status..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
            >
              {petToEdit ? 'Save Changes' : 'Register Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
