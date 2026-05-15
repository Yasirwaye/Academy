import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Star, Users } from 'lucide-react';

const programs = [
  { icon: Zap, name: 'Junior Academy', ages: 'Ages 10–12', desc: 'Foundation skills, fun play, and introduction to tactical awareness in a nurturing environment.', color: 'from-yellow-400/20 to-yellow-600/10' },
  { icon: Shield, name: 'Youth Development', ages: 'Ages 13–15', desc: 'Intensive technical training, competitive fixtures, and early exposure to professional standards.', color: 'from-cyan-400/20 to-blue-600/10' },
  { icon: Star, name: 'Elite Programme', ages: 'Ages 16–18', desc: 'High-performance training, scouting opportunities, and direct pathways to professional clubs.', color: 'from-purple-400/20 to-purple-600/10' },
  { icon: Users, name: 'Holiday Camps', ages: 'All Ages', desc: 'Short intensive camps during school holidays — perfect for players wanting extra development.', color: 'from-green-400/20 to-green-600/10' },
];

export default function Programs() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-10 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-5xl font-black font-display gradient-text mb-4">Our Programs</h1>
        <p className="text-gray-400 text-lg mb-12">Structured pathways for every stage of a player's development.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {programs.map(({ icon: Icon, name, ages, desc, color }) => (
            <div key={name} className={`glass rounded-2xl p-6 bg-gradient-to-br ${color}`}>
              <Icon className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
              <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{ages}</span>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}