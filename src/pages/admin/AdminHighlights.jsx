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
import { Plus, Pencil, Trash2, Video, Star, StarOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import VideoUpload from '@/components/shared/VideoUpload';
import PhotoUpload from '@/components/shared/PhotoUpload';

const emptyForm = {
  title: '', description: '', video_url: '', thumbnail_url: '',
  match_date: '', squad_id: '', is_featured: false,
};

export default function AdminHighlights() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => db.Highlight.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.Highlight.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast.success('Highlight added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.Highlight.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      toast.success('Highlight updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.Highlight.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success('Highlight deleted');
    },
  });

  const toggleFeatured = (highlight) => {
    updateMutation.mutate({ id: highlight.id, data: { ...highlight, is_featured: !highlight.is_featured } });
  };

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

  const openEdit = (h) => {
    setForm({
      title: h.title || '',
      description: h.description || '',
      video_url: h.video_url || '',
      thumbnail_url: h.thumbnail_url || '',
      match_date: h.match_date || '',
      squad_id: h.squad_id || '',
      is_featured: h.is_featured || false,
    });
    setEditingId(h.id);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const getSquadName = (id) => squads.find(s => s.id === id)?.name || '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Highlight Videos</h1>
          <p className="text-muted-foreground mt-1">Upload and manage match highlight videos.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Highlight
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : highlights.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No highlights yet</p>
          <p className="text-sm mt-1">Upload your first match highlight video.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((h) => (
            <Card key={h.id} className="border-border/50 overflow-hidden group">
              {/* Thumbnail */}
              <div className="aspect-video bg-foreground/5 relative overflow-hidden">
                {h.thumbnail_url ? (
                  <img src={h.thumbnail_url} alt={h.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {h.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-accent text-accent-foreground"><Star className="w-3 h-3 mr-1" />Featured</Badge>
                  </div>
                )}
                {/* Play overlay */}
                {h.video_url && (
                  <a
                    href={h.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                    </div>
                  </a>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2 flex-1">{h.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleFeatured(h)} title={h.is_featured ? 'Unfeature' : 'Feature'}>
                      {h.is_featured ? <StarOff className="w-3.5 h-3.5 text-accent" /> : <Star className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(h)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(h.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {h.match_date && <span>{format(new Date(h.match_date), 'MMM d, yyyy')}</span>}
                  {h.squad_id && <Badge variant="outline" className="text-[10px]">{getSquadName(h.squad_id)}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{editingId ? 'Edit Highlight' : 'New Highlight'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. U-16 vs City FC - Match Highlights" />
            </div>

            <div className="space-y-2">
              <Label>Video *</Label>
              <VideoUpload value={form.video_url} onChange={url => setForm({ ...form, video_url: url })} />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div className="flex items-center gap-4">
                <PhotoUpload value={form.thumbnail_url} onChange={url => setForm({ ...form, thumbnail_url: url })} />
                <p className="text-xs text-muted-foreground">Upload a thumbnail image for the video preview.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Match Date</Label>
                <Input type="date" value={form.match_date} onChange={e => setForm({ ...form, match_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Squad (optional)</Label>
                <Select value={form.squad_id} onValueChange={v => setForm({ ...form, squad_id: v })}>
                  <SelectTrigger><SelectValue placeholder="All squads" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">All squads</SelectItem>
                    {squads.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <Label htmlFor="featured" className="cursor-pointer">Feature this highlight (pin to top)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!form.video_url}>
                {editingId ? 'Update' : 'Save'} Highlight
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}