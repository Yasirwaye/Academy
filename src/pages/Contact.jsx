import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-10 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-5xl font-black font-display gradient-text mb-4">Contact Us</h1>
        <p className="text-gray-400 text-lg mb-12">Get in touch with the Eastleigh United FC Academy team.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, label: 'Email', value: 'eastleigh_unitedfc.com', href: 'mailto:eastleigh_unitedfc.com' },
            { icon: Phone, label: 'Phone', value: '+254 722 218 608', href: 'tel:+254722218608' },
            { icon: MapPin, label: 'Location', value: 'Nairobi, Eastleigh', href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
              {href ? (
                <a href={href} className="text-white font-semibold text-sm hover:text-cyan-400 transition-colors">{value}</a>
              ) : (
                <p className="text-white font-semibold text-sm">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}