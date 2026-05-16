import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const coaches = [
  { name: 'Head Coach', role: 'Technical Director', bio: 'UEFA Pro License holder with 5+ years developing elite youth talent across Africa and Europe.' },
  { name: 'Fitness Coach', role: 'Strength & Conditioning', bio: 'Specialist in youth athletic development with a background in sports science and injury prevention.' },
  { name: 'Goalkeeping Coach', role: 'GK Specialist', bio: 'Former professional goalkeeper bringing hands-on experience to the next generation of shot-stoppers.' },
  { name: 'Youth Coach', role: 'Junior Academy Lead', bio: 'Passionate about grassroots football and creating a fun, competitive environment for young players.' },
];

export default function Coaches() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-10 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-5xl font-black font-display gradient-text mb-4">Our Coaches</h1>
        <p className="text-gray-400 text-lg mb-12">Meet the experienced professionals shaping the next generation of footballers.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {coaches.map(({ name, role, bio }) => (
            <div key={name} className="glass rounded-2xl p-6 flex gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/20 flex items-center justify-center shrink-0 text-xl font-black text-cyan-400 font-display">
                {name[0]}
              </div>
              <div>
                <h3 className="text-white font-bold">{name}</h3>
                <p className="text-cyan-400 text-xs font-semibold mb-2">{role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}