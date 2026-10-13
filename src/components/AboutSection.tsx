import { useEffect, useState } from "react";
import { ChevronDown, Target, Eye, Award, TrendingUp } from "lucide-react";

// Counter component for smooth animated count-up effect
const Counter = ({ 
  targetValue, 
  duration = 2000, 
  trigger 
}: { 
  targetValue: number; 
  duration?: number; 
  trigger: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only run animation when trigger condition is met
    if (!trigger) {
      setCount(0); // Reset count when condition is not met
      return;
    }

    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth ease-out animation curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * targetValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [targetValue, duration, trigger]);

  return <span>{count}</span>;
};

const AboutSection = () => {
  // Parsed numerical targets and suffixes for smooth counting
  const stats = [
    { targetNumber: 500, suffix: "+", label: "Placements", icon: Target },
    { targetNumber: 50, suffix: "+", label: "Clients", icon: Eye },
    { targetNumber: 8, suffix: "+", label: "Years", icon: Award },
    { targetNumber: 98, suffix: "%", label: "Satisfaction", icon: TrendingUp },
  ];

  // Set default state to false (closed), so it triggers on start when closed
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 bg-muted/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 md:px-8 relative">
        {/* Collapsible About */}
        <div className="mb-10">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-1 gradient-text">
                About Us
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Your Trusted Partner in Workforce Solutions
              </h2>
            </div>
            <ChevronDown
              size={24}
              className={`text-accent shrink-0 ml-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {expanded && (
            <div className="mt-4 max-w-3xl animate-fade-in">
              <p className="text-muted-foreground leading-relaxed mb-3">
                Menokraft Services LTD is a Lagos-based human capital company
                dedicated to bridging the gap between exceptional talent and
                forward-thinking organizations across Nigeria and beyond.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With deep expertise in HR, outsourcing, corporate training, and
                management consulting, we deliver tailored solutions that drive
                real business outcomes. Our commitment to excellence has made us a
                trusted partner for companies of all sizes.
              </p>
            </div>
          )}
        </div>

        {/* Horizontal Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border rounded-xl p-6 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              <stat.icon size={24} className="text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-extrabold gradient-text mb-1">
                <Counter 
                  targetValue={stat.targetNumber} 
                  trigger={!expanded} // Triggers count-up when accordion is closed (!expanded)
                />
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;