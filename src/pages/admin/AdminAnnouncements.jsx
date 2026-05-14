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
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const types = ['general', 'training', 'match', 'event'];
const typeColors = {
  general: 'bg-secondary text-secondary-foreground',
  training: 'bg-primary/10 text-primary',
  match: 'bg-chart-2/10 text-chart-2',
  event: 'bg-chart-3/10 text-chart-3',
};

const emptyAnnouncement = { title: '', content: '', type: 'general', squad_id: '' };

export default function AdminAnnouncements() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyAnnouncement);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => db.Announcement.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.Announcement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setDialogOpen(false);
      setForm(emptyAnnouncement);
      toast.success('Announcement created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.Announcement.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setDialogOpen(false);
      setForm(emptyAnnouncement);
      setEditingId(null);
      toast.success('Announcement updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.Announcement.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.squad_id) delete data.squad_id;
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEdit = (a) => {
    setForm({
      title: a.title || '',
      content: a.content || '',
      type: a.type || 'general',
      squad_id: a.squad_id || '',
    });
    setEditingId(a.id);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setForm(emptyAnnouncement);
    setEditingId(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Manage Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage academy announcements.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> New Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {announcements.map((a) => (
            <Card key={a.id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{a.title}</h3>
                      <Badge className={`${typeColors[a.type] || typeColors.general} text-xs`}>{a.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {a.created_date ? format(new Date(a.created_date), 'MMM d, yyyy') : ''}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(a.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            <DialogTitle className="font-heading text-xl">{editingId ? 'Edit' : 'New'} Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {types.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Squad (optional)</Label>
                <Select value={form.squad_id} onValueChange={v => setForm({ ...form, squad_id: v })}>
                  <SelectTrigger><SelectValue placeholder="All Squads" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">All Squads</SelectItem>
                    {squads.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} required />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}