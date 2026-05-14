import React from 'react';
import { ChevronRight } from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      title: "Full-Size FIFA Pitch",
      description: "Professional-grade natural turf with floodlighting and drainage systems",
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Performance Gym",
      description: "Elite strength and conditioning equipment with dedicated sports science lab",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Tactical Classroom",
      description: "Video analysis suite with interactive whiteboards and stadium seating",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">World-Class Facilities</h2>
          <p className="text-gray-400">Train in an environment designed for elite performance</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {facilities.map((facility, idx) => (
            <div key={idx} className="glass rounded-2xl overflow-hidden card-hover group">
              <div className="h-48 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{facility.title}</h3>
                <p className="text-gray-400 text-sm">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;