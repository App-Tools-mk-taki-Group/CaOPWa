import CosmicBackground from "@/components/cosmic-background";
import RealTimeClock from "@/components/real-time-clock";
import Calendar from "@/components/calendar";
import Chat from "@/components/chat";
import Translator from "@/components/translator";
import UtilityTools from "@/components/utility-tools";
import { Rocket } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="cosmic-bg min-h-screen cosmic-text font-sans overflow-x-hidden">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[hsl(174,100%,70%)] rounded-full flex items-center justify-center animate-glow">
                <Rocket className="text-[hsl(217,41%,11%)] font-bold" size={20} />
              </div>
              <h1 className="text-2xl font-bold cosmic-accent" data-testid="app-title">CaOPWa</h1>
              <span className="text-sm cosmic-text opacity-70">Cosmic Operations Platform</span>
            </div>
            
            <RealTimeClock />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calendar & Tools */}
          <div className="lg:col-span-1 space-y-8">
            <Calendar />
            <UtilityTools />
          </div>

          {/* Center Column: Chat */}
          <div className="lg:col-span-1">
            <Chat />
          </div>

          {/* Right Column: Translator */}
          <div className="lg:col-span-1">
            <Translator />
          </div>
        </div>
      </main>
    </div>
  );
}
