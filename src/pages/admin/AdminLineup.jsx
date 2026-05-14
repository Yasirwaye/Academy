import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Users, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import PitchView from '@/components/squads/PitchView';

const FORMATIONS = {
  '4-3-3': { rows: [[1], [4, 2, 5, 3], [8, 6, 7], [11, 9, 10]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CM', 'CM', 'RW', 'ST', 'LW'] },
  '4-4-2': { rows: [[1], [4, 2, 5, 3], [7, 8, 6, 11], [9, 10]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST'] },
  '5-3-2': { rows: [[1], [5, 2, 3, 4, 6], [8, 7, 9], [10, 11]], labels: ['GK', 'RWB', 'CB', 'CB', 'CB', 'LWB', 'CM', 'CM', 'CM', 'ST', 'ST'] },
  '4-2-3-1': { rows: [[1], [4, 2, 5, 3], [6, 8], [7, 10, 11], [9]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CDM', 'RW', 'CAM', 'LW', 'ST'] },
  '3-5-2': { rows: [[1], [2, 3, 4], [6, 7, 8, 9, 10], [11, 5]], labels: ['GK', 'CB', 'CB', 'CB', 'ST', 'ST', 'RM', 'CM', 'CM', 'CM', 'LM'] },
  '4-1-4-1': { rows: [[1], [4, 2, 5, 3], [6], [7, 8, 9, 10], [11]], labels: ['GK', 'RB', 'CB', 'CB', 'LB', 'DM', 'RM', 'CM', 'CM', 'LM', 'ST'] },
};

export default function AdminLineup() {
  const [selectedSquad, setSelectedSquad] = useState('');
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState(Array(11).fill(''));
  const [substitutes, setSubstitutes] = useState([]);
  const queryClient = useQueryClient();

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => db.Player.list(),
  });

  const squad = squads.find(s => s.id === selectedSquad);
  const squadPlayers = players.filter(p => p.squad_id === selectedSquad);

  useEffect(() => {
    if (squad) {
      setFormation(squad.formation || '4-3-3');
      const l = squad.lineup || [];
      setLineup([...l, ...Array(11).fill('')].slice(0, 11));
      setSubstitutes(squad.substitutes || []);
    } else {
      setLineup(Array(11).fill(''));
      setSubstitutes([]);
    }
  }, [selectedSquad, squads]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.Squad.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      toast.success('Lineup saved');
    },
  });

  const handleSave = () => {
    if (!selectedSquad) return;
    updateMutation.mutate({
      id: selectedSquad,
      data: { formation, lineup: lineup.filter(Boolean), substitutes },
    });
  };

  const setPlayerInSlot = (slotIdx, playerId) => {
    const newLineup = [...lineup];
    // Remove from other slots first
    const existingIdx = newLineup.indexOf(playerId);
    if (existingIdx !== -1 && existingIdx !== slotIdx) newLineup[existingIdx] = '';
    newLineup[slotIdx] = playerId;
    setLineup(newLineup);
    // Remove from subs if added to lineup
    setSubstitutes(prev => prev.filter(id => id !== playerId));
  };

  const toggleSub = (playerId) => {
    if (substitutes.includes(playerId)) {
      setSubstitutes(substitutes.filter(id => id !== playerId));
    } else {
      setSubstitutes([...substitutes, playerId]);
      // Remove from lineup
      setLineup(lineup.map(id => id === playerId ? '' : id));
    }
  };

  const getPlayer = (id) => players.find(p => p.id === id);
  const usedIds = [...lineup.filter(Boolean), ...substitutes];
  const unassigned = squadPlayers.filter(p => !usedIds.includes(p.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Squad Lineup</h1>
          <p className="text-muted-foreground mt-1">Set formation, starting lineup and substitutes for each squad.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={!selectedSquad || updateMutation.isPending}>
          <Save className="w-4 h-4 mr-2" /> Save Lineup
        </Button>
      </div>

      {/* Squad & formation selector */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Squad</label>
          <Select value={selectedSquad} onValueChange={setSelectedSquad}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Choose squad" /></SelectTrigger>
            <SelectContent>
              {squads.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {selectedSquad && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Formation</label>
            <Select value={formation} onValueChange={setFormation}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(FORMATIONS).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedSquad ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a squad to set up lineup</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pitch + Lineup slots */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="font-heading text-lg">Formation — {formation}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative bg-gradient-to-b from-emerald-800 to-emerald-700 rounded-xl overflow-hidden" style={{ minHeight: 480 }}>
                  {/* Pitch lines */}
                  <div className="absolute inset-4 border border-white/20 rounded" />
                  <div className="absolute left-4 right-4 top-1/2 border-t border-white/20" />
                  <div className="absolute left-1/2 top-4 bottom-4 border-l border-white/20" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/20" />
                  {/* Goal area top */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-white/20" />

                  {/* Render formation rows */}
                  <div className="relative z-10 flex flex-col justify-between h-full py-6 px-2" style={{ minHeight: 480 }}>
                    {FORMATIONS[formation].rows.map((rowSlots, rowIdx) => (
                      <div key={rowIdx} className="flex justify-around items-center">
                        {rowSlots.map((slot, colIdx) => {
                          const slotIdx = FORMATIONS[formation].rows.slice(0, rowIdx).reduce((acc, r) => acc + r.length, 0) + colIdx;
                          const playerId = lineup[slotIdx];
                          const player = getPlayer(playerId);
                          const label = FORMATIONS[formation].labels[slotIdx];
                          return (
                            <div key={colIdx} className="flex flex-col items-center gap-1 min-w-[60px]">
                              <Select value={playerId || ''} onValueChange={v => setPlayerInSlot(slotIdx, v)}>
                                <SelectTrigger className="w-12 h-12 rounded-full p-0 border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:ring-0 flex items-center justify-center">
                                  {player ? (
                                    player.photo_url ? (
                                      <img src={player.photo_url} className="w-full h-full rounded-full object-cover" alt={player.full_name} />
                                    ) : (
                                      <span className="text-sm font-bold">{player.jersey_number || player.full_name[0]}</span>
                                    )
                                  ) : (
                                    <span className="text-xs text-white/60">+</span>
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value=" ">— Empty —</SelectItem>
                                  {squadPlayers.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.full_name} ({p.position})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-white/80 uppercase">{label}</p>
                                {player && <p className="text-[9px] text-white/60 truncate max-w-[60px]">{player.full_name.split(' ')[0]}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Substitutes */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Substitutes ({substitutes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {substitutes.map(id => {
                    const p = getPlayer(id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-sm">
                        {p.photo_url && <img src={p.photo_url} className="w-5 h-5 rounded-full object-cover" alt="" />}
                        <span>{p.full_name}</span>
                        <span className="text-muted-foreground text-xs">#{p.jersey_number || '?'}</span>
                        <button onClick={() => toggleSub(id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  {substitutes.length === 0 && (
                    <p className="text-sm text-muted-foreground">No substitutes selected.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player pool */}
          <div className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading text-base">Squad Players</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[520px] overflow-y-auto">
                {squadPlayers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No players in this squad.</p>
                ) : (
                  squadPlayers.map(p => {
                    const inLineup = lineup.includes(p.id);
                    const inSubs = substitutes.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                          inLineup ? 'border-primary/40 bg-primary/5' : inSubs ? 'border-accent/40 bg-accent/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                          {p.photo_url ? (
                            <img src={p.photo_url} alt={p.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {p.full_name[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.full_name}</p>
                          <p className="text-xs text-muted-foreground">{p.position} {p.jersey_number ? `#${p.jersey_number}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {inLineup && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">XI</Badge>}
                          {inSubs && <Badge className="bg-accent/10 text-accent-foreground border-0 text-[10px]">SUB</Badge>}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => toggleSub(p.id)}
                          >
                            {inSubs ? 'Remove' : 'Sub'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {unassigned.length > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                {unassigned.length} player{unassigned.length > 1 ? 's' : ''} not assigned
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}