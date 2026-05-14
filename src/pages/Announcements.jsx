import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';

const typeColors = {
  general: 'bg-secondary text-secondary-foreground',
  training: 'bg-primary/10 text-primary',
  match: 'bg-chart-2/10 text-chart-2',
  event: 'bg-chart-3/10 text-chart-3',
};

export default function Announcements() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => db.Announcement.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const getSquadName = (id) => squads.find(s => s.id === id)?.name || '';

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
        <h1 className="font-heading text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-1">Stay up to date with the latest academy news.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {announcements.map((a) => (
            <Card key={a.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={typeColors[a.type] || typeColors.general}>{a.type}</Badge>
                    {a.squad_id && (
                      <Badge variant="outline">{getSquadName(a.squad_id)}</Badge>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  {a.created_date ? format(new Date(a.created_date), 'MMMM d, yyyy') : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}