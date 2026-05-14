import React from 'react';

const FORMATIONS = {
  '4-3-3': { rows: [[1], [4, 2, 5, 3], [8, 6, 7], [11, 9, 10]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CM', 'CM', 'RW', 'ST', 'LW'] },
  '4-4-2': { rows: [[1], [4, 2, 5, 3], [7, 8, 6, 11], [9, 10]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST'] },
  '5-3-2': { rows: [[1], [5, 2, 3, 4, 6], [8, 7, 9], [10, 11]], labels: ['GK', 'RWB', 'CB', 'CB', 'CB', 'LWB', 'CM', 'CM', 'CM', 'ST', 'ST'] },
  '4-2-3-1': { rows: [[1], [4, 2, 5, 3], [6, 8], [7, 10, 11], [9]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CDM', 'RW', 'CAM', 'LW', 'ST'] },
  '3-5-2': { rows: [[1], [2, 3, 4], [6, 7, 8, 9, 10], [11, 5]], labels: ['GK', 'CB', 'CB', 'CB', 'ST', 'ST', 'RM', 'CM', 'CM', 'CM', 'LM'] },
  '4-1-4-1': { rows: [[1], [4, 2, 5, 3], [6], [7, 8, 9, 10], [11]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'DM', 'RM', 'CM', 'CM', 'LM', 'ST'] },
};

export default function PitchView({ formation, lineup = [], players = [] }) {
  const config = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const getPlayer = (id) => players.find(p => p.id === id);

  let slotIdx = 0;

  return (
    <div className="relative bg-gradient-to-b from-emerald-800 to-emerald-700 rounded-xl overflow-hidden" style={{ minHeight: 380 }}>
      {/* Pitch markings */}
      <div className="absolute inset-3 border border-white/20 rounded" />
      <div className="absolute left-3 right-3 top-1/2 border-t border-white/15" />
      <div className="absolute left-1/2 top-3 bottom-3 border-l border-white/10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/15" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-7 border-b border-x border-white/15" />

      <div className="relative z-10 flex flex-col justify-between h-full py-5 px-2" style={{ minHeight: 380 }}>
        {config.rows.map((row, rowIdx) => {
          const rowNodes = row.map((_, colIdx) => {
            const currentSlot = slotIdx;
            slotIdx++;
            const playerId = lineup[currentSlot];
            const player = getPlayer(playerId);
            const label = config.labels[currentSlot];
            return { player, label, currentSlot };
          });

          return (
            <div key={rowIdx} className="flex justify-around items-center">
              {rowNodes.map(({ player, label, currentSlot }) => (
                <div key={currentSlot} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center ${
                    player ? 'border-white/70 bg-white/10' : 'border-white/20 bg-white/5'
                  }`}>
                    {player ? (
                      player.photo_url ? (
                        <img src={player.photo_url} alt={player.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-xs">
                          {player.jersey_number || player.full_name[0]}
                        </span>
                      )
                    ) : (
                      <span className="text-white/30 text-xs">?</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-white/70 uppercase tracking-wide">{label}</p>
                    {player && (
                      <p className="text-[9px] text-white/55 truncate max-w-[55px]">
                        {player.full_name.split(' ').pop()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Formation label */}
      <div className="absolute bottom-2 right-3">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{formation}</span>
      </div>
    </div>
  );
}