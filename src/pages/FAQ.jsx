import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What age groups do you accept?', a: 'We accept players aged 10–18 across our Junior Academy, Youth Development, and Elite Programme tiers.' },
  { q: 'How do I apply for a trial?', a: 'Fill in the application form on our homepage. Our scouting team will review it and contact you within 5 working days to arrange a trial session.' },
  { q: 'What is the cost of joining the academy?', a: 'Fees vary by programme tier. Contact us at eastleigh_unitedfc.com for a full breakdown of fees and available scholarships.' },
  { q: 'Do you offer scholarships?', a: 'Yes. We have a limited number of merit-based scholarships for exceptional talent. Mention your interest in the application form.' },
  { q: 'How many sessions per week?', a: 'Junior Academy trains twice a week. Youth Development and Elite Programme train 3–4 times per week plus competitive fixtures.' },
  { q: 'Do you have goalkeeping-specific coaching?', a: 'Absolutely. Our dedicated goalkeeping coach runs position-specific sessions alongside the main squad training.' },
  { q: 'Can players from outside Nairobi join?', a: 'Yes. We welcome players from across Kenya and East Africa. Reach out to discuss accommodation options for travelling players.' },
  { q: 'What happens after the Elite Programme?', a: 'We actively work with professional clubs and agents to find placements for our graduating players. We have placed 25+ players in professional contracts to date.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-4 text-left">
        <span className="text-white font-semibold text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">{a}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-10 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-5xl font-black font-display gradient-text mb-4">FAQ</h1>
        <p className="text-gray-400 text-lg mb-12">Answers to the most common questions about Eastleigh United FC Academy.</p>

        <div className="space-y-3">
          {faqs.map(item => <FAQItem key={item.q} {...item} />)}
        </div>
      </div>
    </div>
  );
}