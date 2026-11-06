import React from 'react';
import {
  PawPrint,
  Heart,
  Calendar,
  Syringe,
  Pill,
  Utensils,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { HERO_IMAGE, DOG_IMAGE, CAT_IMAGE, RABBIT_IMAGE } from '../data/seedData';
import { UserRole } from '../types';

interface LandingHeroProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onQuickDemo: (role: UserRole) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAuth,
  onQuickDemo,
}) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section (split 2-column with high-fidelity visual anchor) */}
      <section className="bg-gradient-to-b from-teal-50/50 via-white to-white rounded-3xl border border-teal-100/60 p-8 sm:p-12 lg:p-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100/80 text-teal-800 rounded-full text-xs font-semibold">
              <PawPrint className="w-3.5 h-3.5" />
              Complete Pet Care Management System
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Every vaccination, meal, and vet visit. All in one place.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              An intelligent, compassionate platform designed for pet owners, licensed veterinarians, and clinic administrators to monitor pet health records, coordinate veterinary appointments, and ensure timely nutritional care.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="py-3 px-6 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition"
              >
                Sign In
              </button>
            </div>

            {/* Instant Demo Role Access Cards */}
            <div className="pt-6 border-t border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Instant Demo Access (No Typing Required)
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <button
                  onClick={() => onQuickDemo('owner')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 rounded-xl text-left transition group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-teal-800">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Pet Owner
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Emily Davis</span>
                </button>
                <button
                  onClick={() => onQuickDemo('vet')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 rounded-xl text-left transition group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-sky-800">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                    Veterinarian
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Dr. Sarah, DVM</span>
                </button>
                <button
                  onClick={() => onQuickDemo('admin')}
                  className="p-2.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl text-left transition group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-indigo-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Admin
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Alex Vance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src={HERO_IMAGE}
                alt="Veterinary Doctor caring for Golden Retriever"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Jenkins, DVM</h4>
                    <p className="text-[11px] text-slate-500">City Animal Health & Wellness</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Verified Practice
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Comprehensive Pet Care Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Engineered for Total Pet Longevity & Wellness
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Eliminate missed boosters, misplaced clinical papers, and nutrition guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Syringe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Vaccine & Health Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated booster countdowns, batch certificate verification, temperature and clinical vital tracking with instant notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Veterinary Booking System</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book consultations with certified specialists, manage schedules, receive real-time appointment confirmations and clinical summaries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nutrition & Feeding Routines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daily meal checklists, species-specific portion calculators, dietary warnings against toxic foods, and hydration tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
