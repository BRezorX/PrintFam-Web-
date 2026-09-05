'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/home/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { ComparisonSlider } from '../components/home/ComparisonSlider';
import { HowItWorks } from '../components/home/HowItWorks';
import { BenefitsGrid } from '../components/home/BenefitsGrid';
import { DashboardShowcase } from '../components/home/DashboardShowcase';
import { TargetAudience } from '../components/home/TargetAudience';
import { RoiCalculator } from '../components/home/RoiCalculator';
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

        {/* 3. HOW IT WORKS 4-Step Process Bar */}
        <HowItWorks />

        {/* 4. Benefits Feature Grid */}
        <BenefitsGrid />

        {/* 5. Interactive Desktop Dashboard Application Showcase */}
        <DashboardShowcase onOpenCustomerSimulator={() => setSimulatorOpen(true)} />

        {/* 6. FOR PRINT SHOPS Target Audience Grid */}
        <TargetAudience />

        {/* 7. Shop ROI & Time Saved Calculator */}
        <RoiCalculator />

        {/* 8. Frequently Asked Questions */}
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
