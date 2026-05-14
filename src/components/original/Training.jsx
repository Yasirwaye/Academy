import React from 'react';
import { Target, Activity, Dumbbell, Users, ChevronRight } from 'lucide-react';

const Training = () => {
  const programs = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Technical Skills",
      description: "Ball mastery, passing precision, and shooting technique developed through repetitive drills and small-sided games.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Tactical Awareness",
      description: "Game intelligence, positional play, and decision-making training using video analysis and scenario-based sessions.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Physical Conditioning",
      description: "Age-appropriate strength, speed, agility, and endurance programs designed by sports scientists.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sports Science",
      description: "Nutrition planning, injury prevention, recovery protocols, and mental performance coaching.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">Training & Development</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our comprehensive curriculum covers every aspect of modern football development
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 card-hover">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-white mb-4`}>
                {program.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{program.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{program.description}</p>
              <button className="flex items-center text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;