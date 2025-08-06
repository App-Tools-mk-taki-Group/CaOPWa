import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="glass-morphism rounded-xl p-6 animate-float" data-testid="calendar-component">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CalendarIcon className="cosmic-accent mr-3" size={20} />
        Stellar Calendar
      </h2>
      
      <div className="calendar-container">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] transition-all border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="button-prev-month"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="text-center">
            <div className="text-lg font-semibold cosmic-accent" data-testid="text-current-month">
              {monthNames[currentDate.getMonth()]}
            </div>
            <div className="text-sm cosmic-text opacity-70" data-testid="text-current-year">
              {currentDate.getFullYear()}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="p-2 rounded-lg cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] transition-all border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="button-next-month"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-center py-2 cosmic-accent font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1" data-testid="calendar-days">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            
            return (
              <div
                key={index}
                className={`text-center py-2 text-sm cursor-pointer rounded transition-all ${
                  isCurrentMonth 
                    ? "cosmic-text hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" 
                    : "cosmic-text opacity-30"
                } ${
                  isToday 
                    ? "bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)] font-bold" 
                    : ""
                }`}
                data-testid={`calendar-day-${day.getDate()}`}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
