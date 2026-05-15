import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Megaphone, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useOutletContext();

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list('-created_date'),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => db.Player.list('-created_date'),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => db.Announcement.list('-created_date'),
  });

  const myPlayer = players.find(p => p.email === user?.email);
  const mySquad = myPlayer ? squads.find(s => s.id === myPlayer.squad_id) : null;

  const statCards = [
    { label: 'Total Squads', value: squads.length, icon: Shield, color: 'text-primary' },
    { label: 'Total Players', value: players.length, icon: Users, color: 'text-chart-2' },
    { label: 'Active Players', value: players.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-chart-3' },
    { label: 'Announcements', value: announcements.length, icon: Megaphone, color: 'text-chart-4' },
  ];

  const typeColors = {
    general: 'bg-secondary text-secondary-foreground',
    training: 'bg-primary/10 text-primary',
    match: 'bg-chart-2/10 text-chart-2',
    event: 'bg-chart-3/10 text-chart-3',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Player'}
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening at the academy.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-heading text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Squad */}
        <Card className="lg:col-span-1 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-lg tracking-wide flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              My Squad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mySquad ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="font-heading text-xl font-bold">{mySquad.name}</p>
                  <Badge className="mt-2 bg-primary/10 text-primary border-0">{mySquad.age_group}</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  {mySquad.coach_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coach</span>
                      <span className="font-medium">{mySquad.coach_name}</span>
                    </div>
                  )}
                  {mySquad.training_schedule && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training</span>
                      <span className="font-medium">{mySquad.training_schedule}</span>
                    </div>
                  )}
                  {myPlayer?.position && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-medium">{myPlayer.position}</span>
                    </div>
                  )}
                  {myPlayer?.jersey_number && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jersey</span>
                      <span className="font-medium">#{myPlayer.jersey_number}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">You haven't been assigned to a squad yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-lg tracking-wide flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-chart-2" />
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{a.title}</h3>
                          <Badge className={`text-[10px] ${typeColors[a.type] || typeColors.general}`}>
                            {a.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {a.created_date ? format(new Date(a.created_date), 'MMM d') : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No announcements yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}