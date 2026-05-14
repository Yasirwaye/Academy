import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { supabase } from '@/api/supabaseClient'; 
import { Quote } from 'lucide-react';

const PlayerSpotlight = () => {
  const [activePlayer, setActivePlayer] = useState(0);

  const { data: spotlights = [], isLoading: isLoadingSpotlights } = useQuery({
    queryKey: ['spotlights'],
    queryFn: () => db.Spotlight.list('order'),
  });

  const { data: allPlayers = [], isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['public_players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_players')
        .select('*');
      
      if (error) {
        console.error('Error fetching public players:', error);
        throw error;
      }
      return data || [];
    },
  });

  const isLoading = isLoadingSpotlights || isLoadingPlayers;

  const getPlayer = (id) => allPlayers.find(p => p.id === id);

  const players = spotlights
    .map(spot => {
      const p = getPlayer(spot.player_id);
      if (!p) return null;
      return { ...p, highlight_text: spot.highlight_text };
    })
    .filter(Boolean)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="py-20 px-4 text-center" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="text-gray-400">Loading players...</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="py-20 px-4 text-center" style={{ backgroundColor: '#0a0e1a' }}>
        <h2 className="text-4xl font-black font-display gradient-text mb-4">Player Spotlight</h2>
        <p className="text-gray-400">No spotlight players set. Add players through the admin panel.</p>
      </div>
    );
  }

  const currentPlayer = players[Math.min(activePlayer, players.length - 1)];
  
  const getFullName = (p) => p.full_name || 'Unnamed Player';

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">Player Spotlight</h2>
          <p className="text-gray-400">Meet the rising stars developing their skills at Eastleigh FC Academy</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Player thumbnails */}
          <div className="grid grid-cols-2 gap-4">
            {players.map((player, idx) => (
              <button
                key={player.id}
                onClick={() => setActivePlayer(idx)}
                className={`relative rounded-2xl overflow-hidden aspect-square transition-all duration-300 ${
                  activePlayer === idx ? 'ring-4 ring-cyan-400 scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {player.photo_url ? (
                  <img src={player.photo_url} alt={getFullName(player)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-4xl font-black text-gray-600 font-display">{getFullName(player)[0]}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-semibold truncate">{getFullName(player)}</p>
                  <p className="text-cyan-400 text-xs">{player.position}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active player details */}
          {currentPlayer && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center shrink-0">
                  {currentPlayer.photo_url ? (
                    <img src={currentPlayer.photo_url} alt={getFullName(currentPlayer)} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-gray-400 font-display">{getFullName(currentPlayer)[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-white">{getFullName(currentPlayer)}</h3>
                  <p className="text-cyan-400">{currentPlayer.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Age', value: currentPlayer.date_of_birth ? Math.floor((new Date() - new Date(currentPlayer.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : '--' },
                  { label: 'Goals', value: currentPlayer.stats_goals ?? 0 },
                  { label: 'Matches', value: currentPlayer.stats_matches ?? 0 },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-2xl font-black gradient-text font-display">{stat.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {(currentPlayer.highlight_text || currentPlayer.notes) && (
                <div className="flex items-start space-x-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <p className="text-gray-300 italic">
                    "{currentPlayer.highlight_text || currentPlayer.notes}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSpotlight;