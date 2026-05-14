import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';

export default function SpotlightPage() {
  const { data: spotlights = [], isLoading } = useQuery({
    queryKey: ['spotlights'],
    queryFn: () => db.Spotlight.list('order'),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => db.Player.list(),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const getPlayer = (id) => players.find(p => p.id === id);
  const getSquad = (id) => squads.find(s => s.id === id);

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
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-3xl font-bold tracking-tight">Player Spotlight</h1>
        </div>
        <p className="text-muted-foreground">Featured players selected by academy staff.</p>
      </div>

      {spotlights.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No players in spotlight yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlights.map((spot) => {
            const player = getPlayer(spot.player_id);
            if (!player) return null;
            const squad = getSquad(player.squad_id);
            return (
              <div
                key={spot.id}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-primary/5 to-muted border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                {/* Photo */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-muted">
                      <User className="w-20 h-20 text-muted-foreground/20" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                  {/* Star badge */}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-accent-foreground" />
                    </div>
                  </div>
                  {/* Jersey number */}
                  {player.jersey_number && (
                    <div className="absolute top-3 left-3">
                      <span className="font-heading text-5xl font-black text-white/10 leading-none">
                        {player.jersey_number}
                      </span>
                    </div>
                  )}
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-xl font-bold text-white leading-tight">{player.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-primary/80 text-white border-0 text-xs backdrop-blur-sm">
                        {player.position}
                      </Badge>
                      {squad && (
                        <span className="text-white/60 text-xs">{squad.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom info */}
                {spot.highlight_text && (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">"{spot.highlight_text}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}