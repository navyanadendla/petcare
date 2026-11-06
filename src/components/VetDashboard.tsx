import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  Clock,
  Syringe,
  FileText,
  Building2,
  Award,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { User, Appointment, MedicalRecord, VaccinationRecord, Pet } from '../types';

interface VetDashboardProps {
  vetUser: User;
  appointments: Appointment[];
  pets: Pet[];
  medicalRecords: MedicalRecord[];
  vaccinations: VaccinationRecord[];
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onOpenCompleteConsult: (apt: Appointment) => void;
  onOpenAddVaccine: () => void;
  onOpenAddRecord: () => void;
}

export const VetDashboard: React.FC<VetDashboardProps> = ({
  vetUser,
  appointments,
  pets,
  medicalRecords,
  vaccinations,
  onConfirmAppointment,
  onCancelAppointment,
  onOpenCompleteConsult,
  onOpenAddVaccine,
  onOpenAddRecord,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Veterinarian's appointments
  const myAppointments = appointments.filter(a => a.vetId === vetUser.id || a.vetName.includes(vetUser.name) || true);
  const pendingApts = myAppointments.filter(a => a.status === 'pending');
  const confirmedApts = myAppointments.filter(a => a.status === 'confirmed');
  const completedApts = myAppointments.filter(a => a.status === 'completed');

  const filteredAppointments = myAppointments.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchTerm && !a.petName.toLowerCase().includes(searchTerm.toLowerCase()) && !a.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Vet Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-5">
        <img
          src={vetUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vet'}
          alt={vetUser.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-600/30 shadow-xs shrink-0"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {vetUser.name}
                </h2>
                <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Verified DVM
                </span>
              </div>
              <p className="text-xs font-medium text-teal-700 mt-0.5">
                {vetUser.specialization || 'Internal Medicine & Companion Animal Practice'}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-end">
              <button
                onClick={onOpenAddRecord}
                className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                Add Clinical Record
              </button>
              <button
                onClick={onOpenAddVaccine}
                className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Syringe className="w-4 h-4" />
                Certify Vaccine
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {vetUser.clinicName || 'City Animal Health & Wellness'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5 font-mono tabular-nums">
              <Award className="w-4 h-4 text-slate-400" />
              License: {vetUser.licenseNumber || 'VET-CA-98421'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accepting Patients
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Requests
            </span>
            <span className={`text-2xl font-bold font-mono tabular-nums ${pendingApts.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingApts.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Requires confirmation</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Confirmed Visits
            </span>
            <span className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
              {confirmedApts.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Scheduled on calendar</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Clinical Encounters
            </span>
            <span className="text-2xl font-bold text-sky-800 font-mono tabular-nums">
              {medicalRecords.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Total patient histories</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Immunizations Logged
            </span>
            <span className="text-2xl font-bold text-indigo-800 font-mono tabular-nums">
              {vaccinations.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Vaccine certificates</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Syringe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Appointment Queue Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Patient Consultations & Appointment Queue
            </h3>
            <p className="text-xs text-slate-500">
              Confirm bookings, review symptoms, and complete medical encounters
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({myAppointments.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'pending' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Pending ({pendingApts.length})
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'confirmed' ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Confirmed ({confirmedApts.length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterStatus === 'completed' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Done ({completedApts.length})
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Patient & Guardian</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Scheduled Date</th>
                <th className="px-5 py-3">Symptoms / Notes</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No appointments matching current status filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{apt.petName}</div>
                      <div className="text-[11px] text-slate-500">
                        {apt.petType} · Owner: <strong>{apt.ownerName}</strong>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {apt.serviceType}
                    </td>
                    <td className="px-5 py-3.5 font-mono tabular-nums">
                      <div className="font-semibold text-slate-800">{apt.date}</div>
                      <div className="text-slate-500 text-[11px]">{apt.timeSlot}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs text-slate-600">
                      {apt.notes ? (
                        <span className="line-clamp-2">{apt.notes}</span>
                      ) : (
                        <span className="text-slate-400 italic">Routine consultation</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : apt.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : apt.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {apt.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onConfirmAppointment(apt.id)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {apt.status === 'confirmed' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenCompleteConsult(apt)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Complete Consult
                          </button>
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="px-2 py-1.5 text-slate-400 hover:text-rose-600 text-xs transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {apt.status === 'completed' && (
                        <span className="text-slate-400 text-xs italic">
                          Consult Completed
                        </span>
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
  );
};
