import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Star, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const MAX_SPOTLIGHT = 4;

export default function AdminSpotlight() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ player_id: '', highlight_text: '', order: 1 });
  const queryClient = useQueryClient();

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

  const createMutation = useMutation({
    mutationFn: (data) => db.Spotlight.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      setDialogOpen(false);
      setForm({ player_id: '', highlight_text: '', order: spotlights.length + 1 });
      toast.success('Player added to spotlight');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.Spotlight.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      toast.success('Player removed from spotlight');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (spotlights.length >= MAX_SPOTLIGHT) {
      toast.error(`Maximum ${MAX_SPOTLIGHT} players allowed in spotlight`);
      return;
    }
    createMutation.mutate({ ...form, order: spotlights.length + 1 });
  };

  const getPlayer = (id) => players.find(p => p.id === id);
  const getSquadName = (id) => squads.find(s => s.id === id)?.name || '';
  const spotlightedIds = spotlights.map(s => s.player_id);
  const availablePlayers = players.filter(p => !spotlightedIds.includes(p.id));
  const isFull = spotlights.length >= MAX_SPOTLIGHT;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Player Spotlight</h1>
          <p className="text-muted-foreground mt-1">
            Choose up to {MAX_SPOTLIGHT} players to feature in the spotlight section.
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
          disabled={isFull}
        >
          <Plus className="w-4 h-4 mr-2" /> Add to Spotlight
        </Button>
      </div>

      {/* Capacity indicator */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {Array.from({ length: MAX_SPOTLIGHT }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                i < spotlights.length
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{spotlights.length}/{MAX_SPOTLIGHT} slots filled</span>
        {isFull && (
          <Badge className="bg-accent/10 text-accent-foreground border-accent/30">
            <AlertCircle className="w-3 h-3 mr-1" /> Spotlight full
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : spotlights.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No players in spotlight</p>
          <p className="text-sm mt-1">Add players to feature them on the public site.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {spotlights.map((spot, idx) => {
            const player = getPlayer(spot.player_id);
            if (!player) return null;
            return (
              <Card key={spot.id} className="border-border/50 overflow-hidden group relative">
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-card/80"
                  onClick={() => deleteMutation.mutate(spot.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                {/* Photo */}
                <div className="aspect-square bg-gradient-to-b from-primary/10 to-muted overflow-hidden">
                  {player.photo_url ? (
                    <img src={player.photo_url} alt={player.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-heading font-bold text-lg leading-tight">{player.full_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">{player.position}</Badge>
                    {player.jersey_number && (
                      <span className="text-xs text-muted-foreground">#{player.jersey_number}</span>
                    )}
                  </div>
                  {player.squad_id && (
                    <p className="text-xs text-muted-foreground mt-1">{getSquadName(player.squad_id)}</p>
                  )}
                  {spot.highlight_text && (
                    <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">"{spot.highlight_text}"</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Add Player to Spotlight</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isFull ? (
              <div className="text-center py-6 text-muted-foreground">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-accent" />
                <p>Spotlight is full ({MAX_SPOTLIGHT}/{MAX_SPOTLIGHT}).</p>
                <p className="text-sm mt-1">Remove a player first to add a new one.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Player *</Label>
                  <Select value={form.player_id} onValueChange={v => setForm({ ...form, player_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose a player" /></SelectTrigger>
                    <SelectContent>
                      {availablePlayers.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name} — {p.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Custom Description (optional)</Label>
                  <Textarea
                    value={form.highlight_text}
                    onChange={e => setForm({ ...form, highlight_text: e.target.value })}
                    placeholder="e.g. Top scorer this season with 12 goals..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!form.player_id}>
                    Add to Spotlight
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}