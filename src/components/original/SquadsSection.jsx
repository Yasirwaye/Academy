import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { supabase } from '@/api/supabaseClient'; 

const FORMATIONS = {
  '4-3-3': { rows: [['GK'], ['RB', 'CB', 'CB', 'LB'], ['CM', 'CM', 'CM'], ['RW', 'ST', 'LW']] },
  '4-4-2': { rows: [['GK'], ['RB', 'CB', 'CB', 'LB'], ['RW', 'CM', 'CM', 'LW'], ['ST', 'ST']] },
  '5-3-2': { rows: [['GK'], ['RWB', 'CB', 'CB', 'CB', 'LWB'], ['CM', 'CM', 'CM'], ['ST', 'ST']] },
  '4-2-3-1': { rows: [['GK'], ['RB', 'CB', 'CB', 'LB'], ['CDM', 'CDM'], ['RW', 'CAM', 'LW'], ['ST']] },
  '3-5-2': { rows: [['GK'], ['CB', 'CB', 'CB'], ['RWB', 'CM', 'CM', 'CM', 'LWB'], ['ST', 'ST']] },
  '4-1-4-1': { rows: [['GK'], ['RB', 'CB', 'CB', 'LB'], ['CDM'], ['RW', 'CM', 'CM', 'LW'], ['ST']] },
};

const getPositionColor = (pos) => {
  if (!pos) return 'bg-gray-500/20 border-gray-500 text-gray-500';
  const p = pos.toUpperCase();
  
  if (p === 'GK') return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
  if (['CB', 'LB', 'RB', 'RWB', 'LWB'].includes(p)) return 'bg-blue-500/20 border-blue-500 text-blue-400';
  if (['CM', 'CDM', 'CAM', 'DM'].includes(p)) return 'bg-green-500/20 border-green-500 text-green-400';
  if (['ST', 'RW', 'LW', 'CF'].includes(p)) return 'bg-red-500/20 border-red-500 text-red-400';
  return 'bg-gray-500/20 border-gray-500 text-gray-500';
};

const SquadsSection = () => {
  const [selectedSquad, setSelectedSquad] = useState(null);

  // Squads can remain as db.Squad.list() assuming that table is public, 
  // or change to supabase.from('squads').select('*') if needed
  const { data: squads = [], isLoading } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['public_players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_players')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching public players:', error);
        throw error;
      }
      return data || [];
    },
  });

  // When squads load, select first
  useEffect(() => {
    if (squads.length > 0 && !selectedSquad) setSelectedSquad(squads[0]);
  }, [squads]);

  const getPlayer = (id) => players.find(p => p.id === id);
  const getFullName = (p) => p?.full_name || 'TBD';

  if (isLoading) {
    return (
      <div className="py-20 px-4 text-center" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="text-gray-400">Loading squads...</div>
      </div>
    );
  }

  if (squads.length === 0) {
    return (
      <div className="py-20 px-4 text-center" style={{ backgroundColor: '#0a0e1a' }}>
        <h2 className="text-4xl font-black font-display gradient-text mb-4">Our Squads</h2>
        <p className="text-gray-400">No squads found. Initialize through admin panel.</p>
      </div>
    );
  }

  const squad = selectedSquad || squads[0];
  const formation = squad?.formation || '4-3-3';
  const formationConfig = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const lineup = squad?.lineup || [];
  const substitutes = squad?.substitutes || [];
  const lineupPlayers = lineup.map(id => getPlayer(id)).filter(Boolean);

  // Build rows from lineup in order based on formation config
  let playerIdx = 0;
  const formationRows = formationConfig.rows.map(rowLabels => {
    return rowLabels.map(label => {
      const player = lineupPlayers[playerIdx] || null;
      playerIdx++;
      return { label, player };
    });
  });

  const squadPlayers = players.filter(p => p.squad_id === squad?.id);
  const assignedIds = [...lineup, ...substitutes];
  const unassigned = squadPlayers.filter(p => !assignedIds.includes(p.id));

  // Helper to categorize players for the bottom list using NEW codes
  const isPosition = (playerPos, category) => {
    const p = (playerPos || '').toUpperCase();
    if (category === 'GK') return p === 'GK';
    if (category === 'DEF') return ['CB', 'LB', 'RB', 'RWB', 'LWB'].includes(p);
    if (category === 'MID') return ['CM', 'CDM', 'CAM', 'DM'].includes(p);
    if (category === 'FWD') return ['ST', 'RW', 'LW', 'CF'].includes(p);
    return false;
  };

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">Our Squads</h2>
          <p className="text-gray-400">Select a squad to view the team lineup and formation</p>
        </div>

        {/* Squad tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {squads.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSquad(s)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSquad?.id === s.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {squad && (
          <div className="glass rounded-2xl p-6 lg:p-8">
            {/* Squad header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black font-display text-white">{squad.name}</h3>
                <p className="text-gray-400 mt-1">
                  Formation: <span className="text-cyan-400">{formation}</span>
                  {squad.age_group && <span> • Age: {squad.age_group}</span>}
                </p>
              </div>
              <div className="flex gap-4">
                {squad.coach_name && (
                  <div className="glass rounded-xl px-4 py-2 text-center">
                    <div className="text-xs text-gray-400">Head Coach</div>
                    <div className="text-white font-semibold">{squad.coach_name}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Formation pitch */}
            <div
              className="relative rounded-xl overflow-hidden mb-8"
              style={{
                background: 'linear-gradient(to bottom, #166534, #15803d)',
                minHeight: 420,
              }}
            >
              {/* Pitch lines */}
              <div className="absolute inset-3 border border-white/20 rounded" />
              <div className="absolute left-3 right-3 top-1/2 border-t border-white/15" />
              <div className="absolute left-1/2 top-3 bottom-3 border-l border-white/10" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/15" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 border-b border-x border-white/15" />

              <div className="relative z-10 flex flex-col justify-between h-full py-6 px-2" style={{ minHeight: 420 }}>
                {formationRows.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-around items-center">
                    {row.map(({ label, player }, colIdx) => (
                      <div key={colIdx} className="flex flex-col items-center gap-1 min-w-[64px]">
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                          player ? 'border-white/70 bg-white/10' : 'border-white/20 bg-white/5'
                        }`}>
                          {player ? (
                            player.photo_url ? (
                              <img src={player.photo_url} alt={getFullName(player)} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold text-sm">
                                {player.jersey_number || getFullName(player)[0]}
                              </span>
                            )
                          ) : (
                            <span className="text-white/30 text-xs font-bold">{label}</span>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">{label}</span>
                          {player && (
                            <p className="text-[9px] text-white/55 truncate max-w-[60px]">
                              {getFullName(player).split(' ').pop()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-2 right-3">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{formation}</span>
              </div>
            </div>

            {/* Substitutes */}
            {substitutes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Substitutes</h4>
                <div className="flex flex-wrap gap-2">
                  {substitutes.map((id, idx) => {
                    const p = getPlayer(id);
                    if (!p) return null;
                    return (
                      <div key={id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${getPositionColor(p.position)}`}>
                        {p.photo_url && <img src={p.photo_url} className="w-6 h-6 rounded-full object-cover" alt="" />}
                        <span className="text-sm font-medium">{getFullName(p)}</span>
                        {p.jersey_number && <span className="text-xs opacity-60">#{p.jersey_number}</span>}
                        <span className="text-xs opacity-60">SUB {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full squad list by position */}
            {['GK', 'DEF', 'MID', 'FWD'].map(pos => {
              const posPlayers = squadPlayers.filter(p => isPosition(p.position, pos));
              
              if (posPlayers.length === 0) return null;
              return (
                <div key={pos} className="mb-4">
                  <div className="formation-line my-3" />
                  <div className="flex flex-wrap gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider w-8 flex items-center ${getPositionColor(pos).split(' ').slice(-1)}`}>{pos}</span>
                    {posPlayers.map(p => (
                      <div key={p.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${getPositionColor(p.position)}`}>
                        {p.photo_url && <img src={p.photo_url} className="w-5 h-5 rounded-full object-cover" alt="" />}
                        <span>{getFullName(p)}</span>
                        {p.jersey_number && <span className="opacity-60">#{p.jersey_number}</span>}
                        {lineup.includes(p.id) && <span className="opacity-60">XI</span>}
                        {substitutes.includes(p.id) && <span className="opacity-60">SUB</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {squadPlayers.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No players in this squad yet. Add players through the admin panel.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquadsSection;