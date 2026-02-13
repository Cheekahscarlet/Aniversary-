
import React from 'react';
import { Heart, Stars } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-pink-400 animate-float opacity-50">
        <Heart size={48} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-purple-400 animate-float opacity-50" style={{ animationDelay: '2s' }}>
        <Heart size={64} fill="currentColor" />
      </div>
      <div className="absolute top-1/4 right-1/4 text-yellow-400 animate-pulse">
        <Stars size={32} />
      </div>

      <div className="container mx-auto px-6 text-center z-10">
        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mb-6">
          <div className="bg-white rounded-full px-6 py-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold uppercase tracking-widest text-sm">
              Happy 8th Anniversary
            </span>
          </div>
        </div>
        
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 text-gray-900 leading-tight">
          Forever <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600 italic">
            & Always
          </span>
        </h1>
        
        <p className="font-script text-3xl md:text-5xl text-purple-700 mb-10 max-w-2xl mx-auto">
          Eight years of laughter, growth, and unconditional friendship.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a href="#gallery" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform duration-300 flex items-center gap-2">
            View Our Memories <Heart size={20} fill="white" />
          </a>
          <a href="#message" className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-100 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors duration-300">
            Read My Note
          </a>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-6 gap-4 transform -rotate-12 translate-x-[-10%] translate-y-[-10%]">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="h-64 bg-pink-300 rounded-3xl"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
