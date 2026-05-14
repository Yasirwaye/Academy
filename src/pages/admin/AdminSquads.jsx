import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

const ageGroups = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'Senior'];

const emptySquad = {
  name: '', age_group: '', coach_name: '', training_schedule: '',
  max_players: 25, description: '',
};

export default function AdminSquads() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptySquad);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: squads = [], isLoading } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list('-created_date'),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => db.Player.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.Squad.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setDialogOpen(false);
      setForm(emptySquad);
      toast.success('Squad created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.Squad.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      setDialogOpen(false);
      setForm(emptySquad);
      setEditingId(null);
      toast.success('Squad updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.Squad.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      toast.success('Squad deleted');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const openEdit = (squad) => {
    setForm({
      name: squad.name || '',
      age_group: squad.age_group || '',
      coach_name: squad.coach_name || '',
      training_schedule: squad.training_schedule || '',
      max_players: squad.max_players || 25,
      description: squad.description || '',
    });
    setEditingId(squad.id);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setForm(emptySquad);
    setEditingId(null);
    setDialogOpen(true);
  };

  const getPlayerCount = (id) => players.filter(p => p.squad_id === id).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Manage Squads</h1>
          <p className="text-muted-foreground mt-1">Create and manage academy squads.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Squad
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : squads.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No squads yet</p>
          <p className="text-sm mt-1">Click "Add Squad" to create one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.map((squad) => (
            <Card key={squad.id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading text-lg font-bold">{squad.name}</h3>
                    <Badge className="mt-1 bg-primary/10 text-primary border-0">{squad.age_group}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(squad)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(squad.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  {squad.coach_name && <p>Coach: {squad.coach_name}</p>}
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{getPlayerCount(squad.id)}/{squad.max_players || 25} players</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{editingId ? 'Edit Squad' : 'New Squad'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Squad Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Age Group *</Label>
                <Select value={form.age_group} onValueChange={v => setForm({ ...form, age_group: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {ageGroups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coach Name</Label>
                <Input value={form.coach_name} onChange={e => setForm({ ...form, coach_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Players</Label>
                <Input type="number" value={form.max_players} onChange={e => setForm({ ...form, max_players: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Training Schedule</Label>
              <Input value={form.training_schedule} onChange={e => setForm({ ...form, training_schedule: e.target.value })} placeholder="e.g. Mon & Wed, 4:00 PM - 6:00 PM" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingId ? 'Update' : 'Create'} Squad
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}