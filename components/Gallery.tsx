
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from '../types';
import { INITIAL_DATA } from '../constants';
import { db } from '../lib/db';
import { Maximize2, Plus, Image as ImageIcon, Trash2, Heart, Loader2, Sparkles, Camera } from 'lucide-react';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    const stored = await db.getAll();
    const storedPhotos: Photo[] = stored
      .filter(m => m.type === 'image')
      .map(m => ({
        id: m.id,
        url: m.data,
        caption: m.name,
        category: 'us'
      }));

    // Merge with defaults from constants if any
    const merged = [...INITIAL_DATA.photos];
    const existingIds = new Set(merged.map(p => p.id));
    storedPhotos.forEach(p => {
      if (!existingIds.has(p.id)) merged.push(p);
    });

    setPhotos(merged.sort((a, b) => b.id.localeCompare(a.id)));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1600; // Large but optimized
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
          } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
          }
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    for (const file of Array.from(files)) {
      const base64 = await compressImage(file);
      const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      await db.save({
        id,
        type: 'image',
        data: base64,
        name: 'Captured: ' + new Date().toLocaleDateString(),
        timestamp: Date.now()
      });
    }
    
    await loadMemories();
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this memory?")) {
      await db.delete(id);
      await loadMemories();
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-6 text-pink-500 animate-pulse">
            <Camera size={32} />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">Our Visual Journey</h2>
          <p className="text-gray-500 max-w-xl mb-8 text-lg">
            Eight years of moments. Upload as many photos as you wish to our eternal friendship vault.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
              {isProcessing ? 'Saving Memories...' : 'Add Unlimited Photos'}
            </button>
            
            {photos.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-4 bg-pink-50 text-pink-600 rounded-2xl font-bold border border-pink-100">
                <Sparkles size={18} />
                <span>{photos.length} Memories Saved</span>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*" className="hidden" />
        </div>

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-pink-100 rounded-[4rem] bg-pink-50/20">
            <div className="relative">
              <ImageIcon size={64} className="text-pink-200 mb-6" />
              <Heart size={24} className="text-pink-400 absolute -top-2 -right-2 animate-bounce" fill="currentColor" />
            </div>
            <p className="text-pink-500 font-display text-3xl font-bold">Waiting for our memories...</p>
            <p className="text-pink-400 mt-2">Start our 8-year celebration by uploading photos!</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid group relative overflow-hidden rounded-[2.5rem] shadow-xl border border-pink-50 bg-pink-50 transform transition-all hover:-translate-y-2">
                <img src={photo.url} alt={photo.caption} className="w-full h-auto block transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                   <div className="flex items-center gap-2 mb-3">
                    <Heart size={16} fill="#f472b6" className="text-pink-400" />
                   </div>
                   <p className="text-white font-bold text-lg mb-4">{photo.caption}</p>
                   <div className="flex gap-3">
                    <button onClick={() => setSelectedImage(photo.url)} className="flex-1 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white text-xs font-bold hover:bg-white/40 transition-colors flex items-center justify-center gap-2">
                      <Maximize2 size={14} /> Full View
                    </button>
                    <button onClick={() => removePhoto(photo.id)} className="w-12 h-12 flex items-center justify-center bg-red-500/80 backdrop-blur-md rounded-2xl text-white hover:bg-red-600 transition-colors shadow-lg">
                      <Trash2 size={18} />
                    </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full animate-in zoom-in-95 duration-300">
            <img src={selectedImage} className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10" alt="Fullscreen View" />
            <button className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2">
              Click anywhere to close <Heart size={16} fill="white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
