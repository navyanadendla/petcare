import React from 'react';
import {
  Heart,
  Calendar,
  Weight,
  Sparkles,
  Edit2,
  Trash2,
  FileText,
  Clock,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
  onViewPassport: (pet: Pet) => void;
  onBookAppointment: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onEdit,
  onDelete,
  onViewPassport,
  onBookAppointment,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Banner & Photo */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={pet.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50 text-teal-700">
            <Heart className="w-10 h-10 mb-1 opacity-70" />
            <span className="text-xs font-medium">{pet.type}</span>
          </div>
        )}

        {/* Species badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-1.5">
          <span>{pet.type}</span>
          <span className="text-slate-400">·</span>
          <span>{pet.gender}</span>
        </div>

        {/* Action quick buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs opacity-90 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(pet)}
            title="Edit Pet Details"
            className="p-1 text-slate-600 hover:text-teal-700 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(pet.id)}
            title="Delete Pet"
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute bottom-2 left-3 bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-mono tabular-nums">
          {pet.weightKg} kg
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {pet.name}
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">
              {pet.ageYears}y {pet.ageMonths}m
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium mb-3">
            {pet.breed}
          </p>

          {/* Quick info strips (Zero-pill discipline: unboxed text with separators) */}
          <div className="text-[12px] text-slate-500 space-y-1 mb-3 pt-2 border-t border-slate-100">
            {pet.microchipId && (
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-400 font-medium">Microchip:</span>
                <span className="font-mono text-slate-700 tabular-nums">{pet.microchipId}</span>
              </div>
            )}
            {pet.allergies && (
              <div className="flex items-center gap-1.5 text-amber-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pet.allergies}</span>
              </div>
            )}
            {pet.specialNeeds && (
              <div className="text-[11px] text-slate-500 line-clamp-1 italic">
                Note: {pet.specialNeeds}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewPassport(pet)}
            className="py-1.5 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Passport
          </button>
          <button
            onClick={() => onBookAppointment(pet)}
            className="py-1.5 px-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Book Vet
          </button>
        </div>
      </div>
    </div>
  );
};
