import React, { useState, useEffect } from 'react';
import Navbar from '@/components/original/Navbar';
import Hero from '@/components/original/Hero';
import HighlightsSection from '@/components/original/HighlightsSection';
import PlayerSpotlight from '@/components/original/PlayerSpotlight';
import Training from '@/components/original/Training';
import Facilities from '@/components/original/Facilities';
import SquadsSection from '@/components/original/SquadsSection';
import Testimonials from '@/components/original/Testimonials';
import ApplicationForm from '@/components/original/ApplicationForm';
import Footer from '@/components/original/Footer';
import AdminPanel from '@/components/original/AdminPanel';

export default function Landing() {
  const [activeSection, setActiveSection] = useState('welcome');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#admin') setShowAdmin(true);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (showAdmin) {
    return <AdminPanel onClose={() => setShowAdmin(false)} />;
  }

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', color: 'white' }}>
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} onAdminClick={() => setShowAdmin(true)} />
      <section id="welcome"><Hero scrollToSection={scrollToSection} /></section>
      <section id="highlights"><HighlightsSection /></section>
      <section id="spotlight"><PlayerSpotlight /></section>
      {/* <section id="training"><Training /></section> */}
      <section id="facilities"><Facilities /></section>
      <section id="squads"><SquadsSection /></section>
      <section id="testimonials"><Testimonials /></section>
      <section id="apply"><ApplicationForm /></section>
      <Footer />
    </div>
  );
}