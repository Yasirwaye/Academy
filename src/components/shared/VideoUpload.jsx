import React, { useRef, useState } from 'react';
import { uploadFile } from '@/api/dataService';
import { Button } from '@/components/ui/button';
import { Upload, X, Video, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function VideoUpload({ value, onChange, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadFile(file);
    onChange(file_url);
    setUrlInput(file_url);
    setUploading(false);
  };

  const handleUrlSubmit = () => {
    onChange(urlInput);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Tabs defaultValue="upload">
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1"><Upload className="w-4 h-4 mr-1" /> Upload File</TabsTrigger>
          <TabsTrigger value="url" className="flex-1"><LinkIcon className="w-4 h-4 mr-1" /> Paste URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-3">
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-muted/30"
            onClick={() => inputRef.current?.click()}
          >
            {value ? (
              <div className="flex flex-col items-center gap-2">
                <Video className="w-10 h-10 text-primary" />
                <p className="text-sm font-medium text-primary">Video uploaded</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{value}</p>
                <Button type="button" variant="outline" size="sm" onClick={e => { e.stopPropagation(); onChange(''); setUrlInput(''); }}>
                  <X className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-medium">{uploading ? 'Uploading...' : 'Click to upload video'}</p>
                <p className="text-xs text-muted-foreground">MP4, MOV, WebM supported</p>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </TabsContent>

        <TabsContent value="url" className="pt-3">
          <div className="flex gap-2">
            <Input
              placeholder="https://youtube.com/... or direct video URL"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
            />
            <Button type="button" onClick={handleUrlSubmit} className="shrink-0">Set</Button>
          </div>
          {value && (
            <p className="text-xs text-primary mt-2 truncate">✓ {value}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}