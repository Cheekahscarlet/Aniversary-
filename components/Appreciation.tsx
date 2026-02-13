
import React, { useState } from 'react';
import { Quote, Sparkles, HeartHandshake, GraduationCap, Clock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const Appreciation: React.FC = () => {
  const [aiNote, setAiNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateAIPoem = async () => {
    setLoading(true);
    try {
      // Correctly initializing GoogleGenAI with process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Write a short, beautiful, and emotional 4-line friendship poem for an 8th anniversary celebration for two best friends named Bon Bon (Inioluwa) and her friend. Mention February and forever. Keep it lighthearted but deeply sentimental.',
        config: {
          temperature: 0.8,
          topP: 0.9,
        }
      });
      setAiNote(response.text || "Eight years of laughter, a bond so true,\nFrom childhood dreams to everything new.\nIn February's cold, our warmth never ends,\nForever and always, the best of friends.");
    } catch (error) {
      console.error(error);
      setAiNote("From schoolyard games to the graduation stage,\nWe've written a beautiful, eight-year page.\nIn this February glow, our friendship stays true,\nForever and always, it's me and it's you.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="message" className="py-24 bg-pink-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-purple-200/30 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl"></div>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border border-pink-100">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-12 text-center text-white relative">
            <Quote size={48} className="mx-auto mb-6 opacity-30" />
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 italic leading-tight">
              A Letter to My <br /> Partner in Crime
            </h2>
            <div className="flex items-center justify-center gap-3 text-pink-100 font-medium">
              <Clock size={18} className="animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-xs">Written Feb 12th, 10:48 PM</span>
            </div>
          </div>

          <div className="p-8 md:p-16 space-y-8">
            <div className="prose prose-lg text-gray-700 font-medium leading-relaxed italic text-center md:text-left space-y-6 max-w-none">
              <p>
                "8 years feels like forever, yet it feels like I still haven’t planned myself enough. 
                I truly appreciate the times we’ve shared — the crazy memories, the moments our friendship 
                has been tested in so many ways, the sacrifices, and how we’ve grown beyond measure while 
                still meeting each other halfway."
              </p>
              <p>
                "Deep down, I’m glad this isn’t just for show — it’s real, legit, and intriguing. 
                Sometimes our friendship tells a story, sometimes it listens, and sometimes it’s a 
                beautiful disaster… and that’s crazy, mehn."
              </p>
              <p>
                "I’ve realised there is no milestone without you in it as my best friend, <strong>Inioluwa</strong>. 
                I’m typing this around 10:48 pm on the 12th of February because I know I’ll be packed 
                with work tomorrow, and I don’t want to forget to remind you that I have you."
              </p>
              <p>
                "You are awesome, and I love you every day — even though I don’t always say it so your 
                head won’t swell like soaked garri 😄. I literally introduce you to everyone I love or 
                who has impacted my life because you are important, and you are family."
              </p>
              <p>
                "I see you. I know you. I feel you, <strong>Bon Bon</strong>."
              </p>
              <p>
                "Get ready — when I make plenty money, hmm hmm, this friendship will scatter everywhere 😄. 
                I can’t wait for paparazzi moments, Maldives trips, Paris, or anywhere you want to visit. 
                I can’t wait for the level of growth we are going to achieve."
              </p>
              <p className="text-2xl font-script text-pink-600 pt-4">
                Thank you for 8 years.<br />
                XOXO<br />
                Love you always, Bon Bon.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-white shadow-inner">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-purple-800 font-bold flex items-center justify-center md:justify-start gap-2 text-xl">
                    <Sparkles size={24} className="text-pink-500" />
                    Anniversary Magic
                  </h3>
                  <p className="text-purple-600/70 text-sm">A little extra sparkle for the 8-year mark</p>
                </div>
                <button 
                  onClick={generateAIPoem}
                  disabled={loading}
                  className="px-6 py-3 bg-pink-500 text-white rounded-2xl text-sm font-bold hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Thinking...' : 'Generate New Magic'}
                  <Sparkles size={16} />
                </button>
              </div>

              <div className="min-h-[120px] flex items-center justify-center text-center px-4">
                {aiNote ? (
                  <p className="font-script text-3xl md:text-4xl text-purple-900 whitespace-pre-line leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {aiNote}
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <HeartHandshake size={32} className="opacity-20" />
                    <p className="italic">Click for a special poem about our 8 years...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appreciation;
