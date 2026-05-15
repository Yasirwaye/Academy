import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Star, Target } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-10 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-5xl font-black font-display gradient-text mb-4">About Us</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          Eastleigh United FC Academy was founded in 2015 with a single mission — to develop world-class footballers from grassroots level to professional contracts.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Trophy, title: 'Our Mission', text: 'To create a professional environment where every young player can reach their full potential through elite coaching, mentorship and competitive exposure.' },
            { icon: Target, title: 'Our Vision', text: 'To be East Africa\'s premier football academy, producing players who compete at the highest levels of domestic and international football.' },
            { icon: Users, title: 'Our Community', text: 'We are more than a football club — we are a family. Our players, coaches, and families form a tight-knit community built on respect and ambition.' },
            { icon: Star, title: 'Our Legacy', text: 'Since 2015, we have produced 250+ graduates, signed 25+ professional contracts, and built a reputation for excellence across the region.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <Icon className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}