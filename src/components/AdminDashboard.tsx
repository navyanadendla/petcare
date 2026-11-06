import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Heart,
  Calendar,
  Syringe,
  Activity,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Check,
  X,
  Search,
} from 'lucide-react';
import { User, Pet, Appointment, VaccinationRecord, NotificationItem } from '../types';

interface AdminDashboardProps {
  users: User[];
  pets: Pet[];
  appointments: Appointment[];
  vaccinations: VaccinationRecord[];
  onToggleVetVerification: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeletePet: (petId: string) => void;
  onBroadcastNotification: (title: string, message: string, targetRole: 'all' | 'owner' | 'vet') => void;
  onResetDatabase: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  pets,
  appointments,
  vaccinations,
  onToggleVetVerification,
  onDeleteUser,
  onDeletePet,
  onBroadcastNotification,
  onResetDatabase,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'vets' | 'pets' | 'appointments' | 'notifications'>('overview');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'owner' | 'vet'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const owners = users.filter(u => u.role === 'owner');
  const vets = users.filter(u => u.role === 'vet');
  const upToDateVaccines = vaccinations.filter(v => v.status === 'Up to date');
  const complianceRate = vaccinations.length > 0 ? Math.round((upToDateVaccines.length / vaccinations.length) * 100) : 100;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    onBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastTarget);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
              Super Admin Console
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Pet Care Management System Administration
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Global directory, veterinarian credential verification, audit logs, and notification dispatch
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset entire system database to initial demo dataset?')) {
              onResetDatabase();
            }
          }}
          className="py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Database
        </button>
      </div>

      {/* System KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Pets</span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{pets.length}</span>
          <span className="text-[11px] text-teal-600 block mt-1">Registered Patients</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Pet Owners</span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{owners.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Active Accounts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Veterinarians</span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{vets.length}</span>
          <span className="text-[11px] text-sky-600 block mt-1">Licensed Practitioners</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Appointments</span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{appointments.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Total Consultations</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Vaccine Compliance</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{complianceRate}%</span>
          <span className="text-[11px] text-slate-500 block mt-1">Core Immunizations</span>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setAdminTab('vets')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'vets' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Veterinarians ({vets.length})
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'users' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pet Owners ({owners.length})
        </button>
        <button
          onClick={() => setAdminTab('pets')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'pets' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Pets ({pets.length})
        </button>
        <button
          onClick={() => setAdminTab('appointments')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'appointments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Appointment Monitor ({appointments.length})
        </button>
        <button
          onClick={() => setAdminTab('notifications')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
            adminTab === 'notifications' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Notification Dispatch
        </button>
      </div>

      {/* Tab: Overview & Broadcast */}
      {adminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Broadcast Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                Dispatch System-Wide Announcement
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Sends an instant real-time notification to pet owners, veterinarians, or all users.
            </p>

            {broadcastSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Notification broadcast successfully transmitted!
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('all')}
                    className={`py-1.5 rounded-lg border text-center font-medium ${
                      broadcastTarget === 'all' ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('owner')}
                    className={`py-1.5 rounded-lg border text-center font-medium ${
                      broadcastTarget === 'owner' ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200'
                    }`}
                  >
                    Pet Owners
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('vet')}
                    className={`py-1.5 rounded-lg border text-center font-medium ${
                      broadcastTarget === 'vet' ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200'
                    }`}
                  >
                    Veterinarians
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Free Rabies Vaccination Clinic This Saturday"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Enter detailed notification message..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Transmit Announcement
              </button>
            </form>
          </div>

          {/* Quick Verification & Compliance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Veterinary Credential Status
            </h3>

            <div className="space-y-3">
              {vets.map(v => (
                <div key={v.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={v.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vet'}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="text-slate-500">{v.clinicName} · License: {v.licenseNumber || 'Verified'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleVetVerification(v.id)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      v.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {v.status === 'verified' ? 'Verified' : 'Pending Review'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Administrators verify credentials, license validity, and malpractice insurance before activating public practitioner profiles.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Veterinarians */}
      {adminTab === 'vets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Registered Veterinarians Directory
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">{vets.length} practitioners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Veterinarian</th>
                  <th className="px-5 py-3">Clinic & Specialization</th>
                  <th className="px-5 py-3">License Number</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vets.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{v.name}</div>
                      <div className="text-[11px] text-slate-400">{v.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{v.clinicName}</div>
                      <div className="text-[11px] text-teal-700">{v.specialization}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {v.licenseNumber || 'VET-CA-98421'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        v.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onToggleVetVerification(v.id)}
                        className="text-xs text-teal-700 hover:underline font-semibold"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Pet Owners */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Registered Pet Owners
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">{owners.length} owners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Owner Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Pets Owned</th>
                  <th className="px-5 py-3 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {owners.map(o => {
                  const ownedPets = pets.filter(p => p.ownerId === o.id);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {o.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{o.email}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">{o.phone || '+1 (555) 234-5678'}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {ownedPets.map(p => p.name).join(', ') || 'No pets yet'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteUser(o.id)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: All Pets */}
      {adminTab === 'pets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              System Registered Pets Database
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">{pets.length} pets recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Pet</th>
                  <th className="px-5 py-3">Species / Breed</th>
                  <th className="px-5 py-3">Owner</th>
                  <th className="px-5 py-3">Age & Weight</th>
                  <th className="px-5 py-3">Microchip ID</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pets.map(pet => (
                  <tr key={pet.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 flex items-center gap-2.5">
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="font-bold text-slate-900">{pet.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {pet.type} · {pet.breed}
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium">
                      {pet.ownerName}
                    </td>
                    <td className="px-5 py-3.5 font-mono tabular-nums text-slate-600">
                      {pet.ageYears}y {pet.ageMonths}m ({pet.weightKg}kg)
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {pet.microchipId || 'None'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onDeletePet(pet.id)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Delete Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Appointments Monitor */}
      {adminTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Global Veterinary Appointments Feed
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">{appointments.length} appointments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Guardian</th>
                  <th className="px-5 py-3">Veterinarian</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{a.petName}</td>
                    <td className="px-5 py-3.5 text-slate-700">{a.ownerName}</td>
                    <td className="px-5 py-3.5 text-slate-800">{a.vetName}</td>
                    <td className="px-5 py-3.5 font-mono tabular-nums">{a.date} at {a.timeSlot}</td>
                    <td className="px-5 py-3.5">{a.serviceType}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Notification Dispatch */}
      {adminTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              Notification Dispatcher
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Broadcast health alerts, clinic holiday hours, and vaccination reminders to users.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Group</label>
              <select
                value={broadcastTarget}
                onChange={e => setBroadcastTarget(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">Broadcast to All Users</option>
                <option value="owner">Pet Owners Only</option>
                <option value="vet">Veterinarians Only</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="Alert Title"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Message</label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Message details..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition"
            >
              Send Notification
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
