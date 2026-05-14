import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Tom Bradley",
      role: "U18 Graduate, Now at Manchester City",
      quote: "Eastleigh Academy gave me the foundation I needed. The coaching staff pushed me beyond my limits every single day.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Sarah Mitchell",
      role: "Parent of U16 Player",
      quote: "The transformation in my son's confidence and ability has been incredible. The facilities are world-class and the staff genuinely care.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "David Okonkwo",
      role: "Senior Squad Captain",
      quote: "I've been here since I was 11. This academy isn't just about football—it's about building character and discipline.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">What Our Players Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 card-hover">
              <Quote className="w-8 h-8 text-cyan-400 mb-4" />
              <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
              <div className="flex items-center space-x-3">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-cyan-400 text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;