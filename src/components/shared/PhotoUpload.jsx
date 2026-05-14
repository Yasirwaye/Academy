import React, { useRef, useState } from 'react';
import { uploadFile } from '@/api/dataService';
import { Button } from '@/components/ui/button';
import { Upload, X, User } from 'lucide-react';

export default function PhotoUpload({ value, onChange, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadFile(file);
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors relative group"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-muted-foreground" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading...' : value ? 'Change Photo' : 'Upload Photo'}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}