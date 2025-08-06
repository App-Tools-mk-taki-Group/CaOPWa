import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="glass-morphism px-4 py-2 rounded-lg" data-testid="real-time-clock">
      <div className="flex items-center space-x-2">
        <Clock className="cosmic-accent" size={16} />
        <span className="cosmic-accent font-mono text-lg" data-testid="current-time">{timeString}</span>
      </div>
    </div>
  );
}
