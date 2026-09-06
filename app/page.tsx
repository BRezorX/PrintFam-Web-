'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/home/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { ComparisonSlider } from '../components/home/ComparisonSlider';
import { BenefitsGrid } from '../components/home/BenefitsGrid';
import { DashboardShowcase } from '../components/home/DashboardShowcase';
import { TargetAudience } from '../components/home/TargetAudience';
import { FaqSection } from '../components/home/FaqSection';
import { Footer } from '../components/home/Footer';
import { CustomerSimulatorModal } from '../components/home/CustomerSimulatorModal';
import { AmbientLightning } from '../components/home/AmbientLightning';

export default function HomePage() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const handleScrollToDashboard = () => {
    const el = document.getElementById('dashboard-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJobSubmitted = (fileName: string, pageCount: number, price: number) => {
    console.log(`Job received: ${fileName}, ${pageCount} pages, ₹${price}`);
  };

  return (
    <div className="min-h-screen bg-[#F3F6FC] text-[#0A1128] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Subtle Ambient & Interactive Click Lightning Layer */}
      <AmbientLightning />

      {/* Top Floating Pill Navigation */}
      <Navbar onOpenDemo={() => setSimulatorOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with 3D Isometric Phone-to-Printer Graphic */}
        <HeroSection 
          onOpenCustomerSimulator={() => setSimulatorOpen(true)} 
          onScrollToDashboard={handleScrollToDashboard}
        />

        {/* 2. Interactive Before vs. After Comparison Slider */}
        <ComparisonSlider />

        {/* 3. Streamlined Dedicated Software & Live Demo Teaser Banner */}
        <section className="py-10 sm:py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Interactive Deep-Dive</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    Want to see the live simulation & setup guide?
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Test the complete customer-to-printer workflow in your browser, check the 45-minute PC setup process, and calculate your shop’s exact monthly profit boost.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Interactive Simulation</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 45-Minute Setup Guide</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ROI & Profit Estimator</span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3">
                  <Link
                    href="/software"
                    className="w-full text-center px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <span>Explore Software & Demo</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSimulatorOpen(true)}
                    className="w-full text-center px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-98 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>⚡ Quick Upload Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Benefits Feature Grid */}
        <BenefitsGrid />

        {/* 5. Interactive Desktop Dashboard Application Showcase */}
        <DashboardShowcase onOpenCustomerSimulator={() => setSimulatorOpen(true)} />

        {/* 6. FOR PRINT SHOPS Target Audience Grid */}
        <TargetAudience />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Conversion Banner & Footer */}
      <Footer />

      {/* Interactive Customer Upload Simulator Modal */}
      <CustomerSimulatorModal 
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onJobSubmitted={handleJobSubmitted}
      />

    </div>
  );
}
