import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/api/dataService';
import { Play, Star } from 'lucide-react';
import { format } from 'date-fns';

// ─── MANUAL HIGHLIGHTS ────────────────────────────────────────────────────────
// To add a video manually: copy your Supabase public URL and paste it below.
// video_url: your .mp4 public URL from Supabase storage
// thumbnail_url: your .jpeg public URL from Supabase storage
const MANUAL_HIGHLIGHTS = [
  {
    id: 'manual-1',
    title: 'Academy Highlight',
    description: '',
    video_url: 'PASTE_YOUR_MP4_URL_HERE',
    thumbnail_url: 'PASTE_YOUR_JPEG_URL_HERE',
    is_featured: true,
    match_date: null,
  },
  // Add more entries by copying the block above
];

const HighlightsSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: dbHighlights = [] } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => db.Highlight.list(),
  });

  // Merge: manual entries (with real URLs) + DB entries
  const manualValid = MANUAL_HIGHLIGHTS.filter(h => !h.video_url.startsWith('PASTE_'));
  const highlights = [...manualValid, ...dbHighlights];

  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
    if (url.includes('youtube.com/watch')) {
      try { return `https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`; } catch { return url; }
    }
    return url;
  };

  const featured = highlights.filter(h => h.is_featured);
  const rest = highlights.filter(h => !h.is_featured);
  const ordered = [...featured, ...rest];

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">Academy Highlights</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Witness the intensity, skill, and passion that defines Eastleigh FC Academy
          </p>
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
                <h3 className="font-display text-xl font-bold">{selectedVideo.title}</h3>
                {selectedVideo.description && <p className="text-gray-400 mt-1 text-sm">{selectedVideo.description}</p>}
              </div>
              <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl font-bold">✕</button>
            </div>
          </div>
        )}

        {highlights.length === 0 ? (
          // fallback — original static video player when no highlights in DB
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img
              src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Video Thumbnail"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-cyan-400/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer">
                <Play className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="mt-4 glass px-6 py-2 rounded-full">
                <span className="text-white font-semibold">2023/24 Season Montage</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Featured Video - Full Width */}
            {featured.length > 0 && (
              <div className="mb-12">
                {featured.map((h) => (
                  <div
                    key={h.id}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedVideo(h)}
                  >
                    {/* Video Player Container */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      {isYouTube(h.video_url) ? (
                        <iframe
                          src={getEmbedUrl(h.video_url)}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          title={h.title}
                        />
                      ) : (
                        <>
                          {/* Thumbnail Overlay */}
                          {h.thumbnail_url ? (
                            <img
                              src={h.thumbnail_url}
                              alt={h.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                              <Play className="w-20 h-20 text-gray-600" />
                            </div>
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                            <div className="w-24 h-24 bg-cyan-400/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-12 h-12 text-cyan-400 ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Video Info Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          {h.is_featured && (
                            <div className="inline-flex items-center gap-1 bg-cyan-400/90 text-[#0a0e1a] text-xs font-bold px-3 py-1 rounded-full mb-3">
                              <Star className="w-3 h-3" /> Featured
                            </div>
                          )}
                          <h3 className="text-2xl font-bold text-white mb-2">{h.title}</h3>
                          {h.description && (
                            <p className="text-gray-300 text-sm max-w-2xl">{h.description}</p>
                          )}
                          {h.match_date && (
                            <p className="text-gray-400 text-sm mt-2">{format(new Date(h.match_date), 'MMMM d, yyyy')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid of Other Highlights */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((h) => (
                  <div
                    key={h.id}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group card-hover"
                    onClick={() => setSelectedVideo(h)}
                  >
                    <div className="aspect-video relative">
                      {h.thumbnail_url ? (
                        <img src={h.thumbnail_url} alt={h.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-cyan-400/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-cyan-400 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 glass">
                      <h3 className="font-semibold text-white text-sm">{h.title}</h3>
                      {h.match_date && (
                        <p className="text-gray-400 text-xs mt-1">{format(new Date(h.match_date), 'MMM d, yyyy')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HighlightsSection;