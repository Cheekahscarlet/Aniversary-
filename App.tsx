
import React, { useEffect, useState, useRef } from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Appreciation from './components/Appreciation';
import { INITIAL_DATA } from './constants';
import { db } from './lib/db';
import { Heart, Volume2, VolumeX, Loader2, AlertCircle, Settings, X, Upload, Download, Copy, Check, Play, SkipForward, Plus, Trash2, Music } from 'lucide-react';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Playlist System
  const [playlist, setPlaylist] = useState<{id?: string, url: string, title: string}[]>([INITIAL_DATA.audio]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAudioMemories();
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadAudioMemories = async () => {
    const stored = await db.getAll();
    const audioMemories = stored
      .filter(m => m.type === 'audio')
      .map(m => ({ id: m.id, url: m.data, title: m.name }));
    
    setPlaylist([INITIAL_DATA.audio, ...audioMemories]);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        handlePlay();
      }
    }
  }, [currentIndex, playlist[currentIndex]?.url]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    setIsLoading(true);
    setHasError(false);
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsLoading(false);
          setHasError(false);
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          setIsLoading(false);
          setHasError(true);
        });
    }
  };

  // Toggle play/pause with interaction handling
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      handlePlay();
    }
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const id = 'audio_' + Date.now();
        await db.save({
          id,
          type: 'audio',
          data: base64,
          name: file.name.replace(/\.[^/.]+$/, ""),
          timestamp: Date.now()
        });
        await loadAudioMemories();
        setIsLoading(false);
        setCurrentIndex(playlist.length); // Play the new song
        setIsPlaying(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAudio = async (id: string) => {
    if (window.confirm("Remove this song from our playlist?")) {
      await db.delete(id);
      await loadAudioMemories();
      if (currentIndex >= playlist.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const generateExportCode = async () => {
    const memories = await db.getAll();
    const photos = memories.filter(m => m.type === 'image').map(m => ({
      id: m.id, url: m.data, caption: m.name, category: 'us' as const
    }));
    const audio = memories.filter(m => m.type === 'audio')[0] || { data: INITIAL_DATA.audio.url, name: INITIAL_DATA.audio.title };
    
    const exportData = {
      photos: photos,
      audio: { url: audio.data, title: audio.name }
    };
    
    return `export const INITIAL_DATA = ${JSON.stringify(exportData, null, 2)};`;
  };

  return (
    <div className="min-h-screen relative selection:bg-pink-300">
      <audio 
        ref={audioRef} 
        src={playlist[currentIndex]?.url} 
        onEnded={nextSong}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="auto" 
      />

      {/* Floating Sparkles Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-pulse text-pink-400"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <Heart size={8 + Math.random() * 12} fill="currentColor" />
          </div>
        ))}
      </div>

      <header className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg animate-float">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <span className={`block font-display text-xl font-bold leading-none ${scrolled ? 'text-gray-900' : 'text-purple-900'}`}>Bonnie & Conny</span>
              <span className="text-[10px] uppercase tracking-widest text-pink-500 font-bold">8 Years Strong</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`hidden md:flex flex-col items-end mr-3 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
                <Music size={10} /> Now Playing
              </span>
              <span className="text-xs font-bold text-purple-700 truncate max-w-[150px]">{playlist[currentIndex]?.title}</span>
            </div>
            
            <button onClick={() => setShowSettings(true)} className="w-12 h-12 rounded-2xl bg-white/50 border border-pink-100 flex items-center justify-center text-pink-500 hover:bg-white transition-all shadow-sm active:scale-95">
              <Settings size={22} />
            </button>
            <button onClick={togglePlay} className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isPlaying ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110' : 'bg-white text-purple-600 border border-purple-100'}`}>
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : hasError ? <AlertCircle size={24} /> : isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            {playlist.length > 1 && isPlaying && (
              <button onClick={nextSong} className="w-12 h-12 rounded-2xl bg-white/50 border border-pink-100 flex items-center justify-center text-purple-500 hover:bg-white transition-all shadow-sm">
                <SkipForward size={22} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-purple-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-10 flex justify-between items-center text-white">
              <div>
                <h3 className="text-2xl font-bold">Memory Vault</h3>
                <p className="text-pink-100 text-sm">Managing our unlimited forever</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-10 space-y-10">
              <section>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Our Soundtrack</p>
                  <span className="text-[11px] font-bold text-pink-500">{playlist.length} Tracks</span>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                  {playlist.map((song, i) => (
                    <div key={i} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${currentIndex === i ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 hover:border-pink-200'}`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentIndex === i ? 'bg-pink-500 text-white animate-pulse' : 'bg-white text-gray-400'}`}>
                          <Music size={14} />
                        </div>
                        <span className="text-sm font-bold text-purple-900 truncate">{song.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {setCurrentIndex(i); setIsPlaying(true);}} className="p-2 text-pink-500 hover:scale-110 transition-transform"><Play size={18} fill={currentIndex === i ? "currentColor" : "none"} /></button>
                        {song.id && (
                          <button onClick={() => removeAudio(song.id!)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => audioFileInputRef.current?.click()} className="mt-4 w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-pink-200 rounded-2xl text-pink-600 text-sm font-bold hover:bg-pink-50 transition-all active:scale-95">
                  <Plus size={20} /> Add New Song
                </button>
                <input type="file" ref={audioFileInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />
              </section>

              <section className="pt-8 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Cloud Sync & Backup</p>
                <button 
                  onClick={async () => {
                    const code = await generateExportCode();
                    setShowExport(code);
                  }}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-95"
                >
                  <Download size={22} /> Pack All Memories
                </button>
                <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
                  Want to share all your new uploads with Inioluwa?<br/>Click this, copy the code, and send it back to the AI!
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in">
          <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-pink-100">
            <div className="p-12 bg-purple-700 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-display font-bold">Memory Sync Package</h3>
                <p className="text-purple-200 text-lg mt-2">Ready to be permanently baked into our friendship site.</p>
              </div>
              <button onClick={() => setShowExport(null)} className="relative z-10 bg-white/20 p-4 rounded-3xl hover:bg-white/30"><X size={32} /></button>
            </div>
            <div className="p-12 space-y-8 text-center">
              <div className="relative bg-gray-950 rounded-[2.5rem] p-10 overflow-hidden h-[450px]">
                <pre className="text-pink-400 text-[10px] overflow-auto h-full scrollbar-hide text-left font-mono">
                  {showExport}
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(showExport || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 px-10 py-5 bg-white text-gray-900 rounded-3xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
                  <span className="text-xl">{copied ? 'Copied to Clipboard!' : 'Copy This Code'}</span>
                </button>
              </div>
              <div className="max-w-xl mx-auto">
                <p className="text-gray-500 text-lg">
                  Paste this code into our chat now. I will update the source code so your friend sees every single photo and song you just added!
                </p>
                <button onClick={() => setShowExport(null)} className="mt-6 font-bold text-pink-500 hover:text-pink-600 transition-colors">I'll do it right now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10">
        <Hero />
        
        {/* Statistics Bar */}
        <section className="py-16 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 text-white relative shadow-inner">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[{v:'8',l:'Years Together'},{v:'96',l:'Months of Fun'},{v:'417',l:'Weeks of Bonding'},{v:'∞',l:'Infinite Future'}].map((s,i)=>(
              <div key={i} className="group">
                <p className="text-6xl font-display font-bold group-hover:scale-110 transition-transform duration-500">{s.v}</p>
                <p className="text-pink-100 uppercase text-xs font-bold tracking-[0.3em] mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <Gallery />
        <Appreciation />

        {/* Closing Section */}
        <section className="py-40 bg-purple-950 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="font-script text-6xl md:text-8xl mb-12 text-pink-200">February is Our Month.</h2>
            <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-12 animate-bounce shadow-2xl border border-pink-500/30">
              <Heart fill="#ec4899" size={48} className="text-pink-500" />
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.6em] opacity-40 font-bold">Best Friends Forever & Beyond</p>
            </div>
          </div>
          
          {/* Background shapes */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </section>
      </main>

      <footer className="py-12 bg-black text-center border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-pink-500 font-bold text-lg">
              <Heart size={20} fill="currentColor" />
              <span>For Bonnie & Inioluwa</span>
            </div>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
              &copy; 2026 Anniversary Celebration • Built with Love & Forever in Mind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
