import CosmicBackground from "@/components/cosmic-background";
import RealTimeClock from "@/components/real-time-clock";
import Calendar from "@/components/calendar";
import Chat from "@/components/chat";
import Translator from "@/components/translator";
import UtilityTools from "@/components/utility-tools";
import { Notes } from "@/components/notes";
import { AdvancedTools } from "@/components/advanced-tools";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, FileText, Zap, MessageCircle, Calendar as CalendarIcon, Languages, Calculator } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: Rocket },
    { id: "notes", name: "Notes", icon: FileText },
    { id: "advanced", name: "Advanced Tools", icon: Zap },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return <Notes />;
      case "advanced":
        return <AdvancedTools />;
      default:
        return (
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
        );
    }
  };

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

      {/* Navigation Tabs */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-blue-500/20">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-blue-200 hover:text-white hover:bg-blue-600/20"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon size={16} />
                  {tab.name}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
