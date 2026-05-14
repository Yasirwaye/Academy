import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, User, ChevronDown, ChevronUp } from 'lucide-react';
import PitchView from '@/components/squads/PitchView';

export default function Squads() {
  const [expandedSquad, setExpandedSquad] = useState(null);

  const { data: squads = [], isLoading } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list('-created_date'),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => db.Player.list(),
  });

  const getPlayerCount = (squadId) => players.filter(p => p.squad_id === squadId).length;
  const getPlayer = (id) => players.find(p => p.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Squads</h1>
        <p className="text-muted-foreground mt-1">Browse all academy squads, formations and lineups.</p>
      </div>

      {squads.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No squads created yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {squads.map((squad) => {
            const count = getPlayerCount(squad.id);
            const isExpanded = expandedSquad === squad.id;
            const squadPlayers = players.filter(p => p.squad_id === squad.id);
            const lineupPlayers = (squad.lineup || []).map(id => getPlayer(id)).filter(Boolean);
            const subPlayers = (squad.substitutes || []).map(id => getPlayer(id)).filter(Boolean);
            const hasLineup = lineupPlayers.length > 0;

            return (
              <Card key={squad.id} className="border-border/50 overflow-hidden">
                {/* Header */}
                <div className="h-1 bg-primary" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-heading text-2xl tracking-wide">{squad.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-primary/10 text-primary border-0">{squad.age_group}</Badge>
                        {squad.formation && (
                          <Badge variant="outline">{squad.formation}</Badge>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Users className="w-4 h-4" />
                          <span>{count}/{squad.max_players || 25} players</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedSquad(isExpanded ? null : squad.id)}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                      {isExpanded ? 'Collapse' : 'View Lineup'}
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                    {squad.coach_name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Coach: <span className="text-foreground font-medium">{squad.coach_name}</span></span>
                      </div>
                    )}
                    {squad.training_schedule && (
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{squad.training_schedule}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {/* Expanded lineup view */}
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="border-t border-border pt-5">
                      {hasLineup ? (
                        <div className="grid lg:grid-cols-2 gap-6">
                          {/* Pitch */}
                          <PitchView
                            formation={squad.formation || '4-3-3'}
                            lineup={squad.lineup || []}
                            players={players}
                          />
                          {/* Subs & unassigned */}
                          <div className="space-y-4">
                            {subPlayers.length > 0 && (
                              <div>
                                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                  Substitutes
                                </h4>
                                <div className="space-y-2">
                                  {subPlayers.map((p, idx) => (
                                    <PlayerRow key={p.id} player={p} label={`SUB ${idx + 1}`} />
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* All squad players */}
                            <div>
                              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                Full Squad
                              </h4>
                              <div className="space-y-1.5">
                                {squadPlayers.map(p => (
                                  <PlayerRow key={p.id} player={p} isInLineup={(squad.lineup || []).includes(p.id)} isInSubs={(squad.substitutes || []).includes(p.id)} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground mb-3">No lineup set. Showing all squad players:</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {squadPlayers.map(p => <PlayerRow key={p.id} player={p} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlayerRow({ player, label, isInLineup, isInSubs }) {
  const statusColors = {
    active: 'bg-primary/10 text-primary',
    injured: 'bg-destructive/10 text-destructive',
    suspended: 'bg-chart-2/10 text-chart-2',
    inactive: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
            {player.full_name[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{player.full_name}</p>
        <p className="text-xs text-muted-foreground">{player.position}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {player.jersey_number && (
          <span className="text-xs font-bold text-muted-foreground">#{player.jersey_number}</span>
        )}
        {label && <Badge className="text-[10px] bg-accent/10 text-accent-foreground border-0">{label}</Badge>}
        {isInLineup && <Badge className="text-[10px] bg-primary/10 text-primary border-0">XI</Badge>}
        {isInSubs && <Badge className="text-[10px] bg-muted text-muted-foreground border-0">SUB</Badge>}
        <Badge className={`text-[10px] border-0 ${statusColors[player.status] || statusColors.active}`}>
          {player.status}
        </Badge>
      </div>
    </div>
  );
}