import React from 'react';
import { X, ShieldCheck, Printer, Calendar, Syringe, Pill, AlertTriangle, Heart, User, Phone, Stethoscope } from 'lucide-react';
import { Pet, VaccinationRecord, Medication, MedicalRecord } from '../types';

interface PetHealthPassportModalProps {
  pet: Pet | null;
  vaccinations: VaccinationRecord[];
  medications: Medication[];
  records: MedicalRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const PetHealthPassportModal: React.FC<PetHealthPassportModalProps> = ({
  pet,
  vaccinations,
  medications,
  records,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !pet) return null;

  const handlePrint = () => {
    window.print();
  };

  const petVaccines = vaccinations.filter(v => v.petId === pet.id);
  const petMeds = medications.filter(m => m.petId === pet.id && m.status === 'Active');
  const petRecords = records.filter(r => r.petId === pet.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden print:shadow-none print:border-none print:m-0">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-teal-200 block">
                  Official Health Credential
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Pet Health Passport
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-medium flex items-center gap-1.5"
                title="Print Passport"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Document</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Pet Identity Banner */}
          <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-xl object-cover border-2 border-white/30 shrink-0 shadow-xs"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {pet.name}
                </h3>
                <span className="text-xs font-mono text-teal-200 bg-white/10 px-2 py-0.5 rounded tabular-nums">
                  Microchip: {pet.microchipId || 'N/A'}
                </span>
              </div>
              <p className="text-sm text-teal-100 font-medium">
                {pet.breed} · {pet.type} ({pet.gender})
              </p>
              <div className="mt-2 text-xs text-teal-50 flex flex-wrap gap-x-4 gap-y-1">
                <span>Age: <strong>{pet.ageYears}y {pet.ageMonths}m</strong></span>
                <span>Current Weight: <strong>{pet.weightKg} kg</strong></span>
                <span>Coat: <strong>{pet.color}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible text-slate-800">
          {/* Owner & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Registered Guardian
                </span>
                <span className="text-xs font-bold text-slate-900">{pet.ownerName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Attending Veterinary Clinic
                </span>
                <span className="text-xs font-bold text-slate-900">City Animal Health & Wellness</span>
              </div>
            </div>
          </div>

          {/* Special Alerts */}
          {(pet.allergies || pet.specialNeeds) && (
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Medical Alerts & Special Notes
              </div>
              {pet.allergies && (
                <p className="mb-0.5"><strong>Allergies:</strong> {pet.allergies}</p>
              )}
              {pet.specialNeeds && (
                <p><strong>Care Notes:</strong> {pet.specialNeeds}</p>
              )}
            </div>
          )}

          {/* Vaccination Immunization Record */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Syringe className="w-4 h-4 text-teal-600" />
                Immunization & Vaccination History
              </h4>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {petVaccines.length} records verified
              </span>
            </div>

            {petVaccines.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No vaccination records on file.</p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {petVaccines.map(vac => (
                  <div key={vac.id} className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-900">{vac.vaccineName}</div>
                      <div className="text-[11px] text-slate-500">
                        Administered: <span className="tabular-nums font-medium text-slate-700">{vac.dateAdministered}</span> · Batch: {vac.batchNumber || 'Standard'}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        vac.status === 'Up to date'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : vac.status === 'Due Soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {vac.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 tabular-nums">
                        Next Due: {vac.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Medications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <Pill className="w-4 h-4 text-amber-600" />
              Active Medication Regimen
            </h4>

            {petMeds.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No active medications prescribed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {petMeds.map(m => (
                  <div key={m.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-teal-700 font-medium text-[11px] mt-0.5">{m.dosage} · {m.frequency}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{m.instructions}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Clinical Encounters */}
          {petRecords.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                Recent Veterinary Clinical Encounters
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {petRecords.slice(0, 3).map(rec => (
                  <div key={rec.id} className="p-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{rec.type}</span>
                      <span className="tabular-nums">{rec.date} · {rec.vetName}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rec.diagnosis}</p>
                    {rec.treatment && (
                      <p className="text-[11px] text-teal-700 mt-1"><strong>Action:</strong> {rec.treatment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Digital Passport certified by PetCare Management System</span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition print:hidden"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
