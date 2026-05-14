import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Star, Play } from 'lucide-react';
import { format } from 'date-fns';

export default function Highlights() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => db.Highlight.list('-created_date'),
  });

  const { data: squads = [] } = useQuery({
    queryKey: ['squads'],
    queryFn: () => db.Squad.list(),
  });

  const getSquadName = (id) => squads.find(s => s.id === id)?.name || '';
  const featured = highlights.filter(h => h.is_featured);
  const rest = highlights.filter(h => !h.is_featured);
  const ordered = [...featured, ...rest];

  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

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
        <h1 className="font-heading text-3xl font-bold tracking-tight">Highlights</h1>
        <p className="text-muted-foreground mt-1">Watch the best moments from our matches.</p>
      </div>

      {/* Video modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              {isYouTube(selectedVideo.video_url) ? (
                <iframe
                  src={getEmbedUrl(selectedVideo.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : (
                <video src={selectedVideo.video_url} controls autoPlay className="w-full h-full" />
              )}
            </div>
            <div className="mt-4 text-white">
              <h2 className="font-heading text-xl font-bold">{selectedVideo.title}</h2>
              {selectedVideo.description && <p className="text-white/60 mt-1 text-sm">{selectedVideo.description}</p>}
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-bold"
            >✕</button>
          </div>
        </div>
      )}

      {highlights.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No highlights yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ordered.map((h) => (
            <Card
              key={h.id}
              className="border-border/50 overflow-hidden group cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all"
              onClick={() => setSelectedVideo(h)}
            >
              <div className="aspect-video bg-foreground/5 relative overflow-hidden">
                {h.thumbnail_url ? (
                  <img src={h.thumbnail_url} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                    <Video className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {h.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      <Star className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                  </div>
                )}
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{h.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {h.match_date && <span>{format(new Date(h.match_date), 'MMM d, yyyy')}</span>}
                  {h.squad_id && <Badge variant="outline" className="text-[10px]">{getSquadName(h.squad_id)}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}