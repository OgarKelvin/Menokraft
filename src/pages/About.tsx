import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Award, TrendingUp } from "lucide-react";

// Counter component for smooth animated count-up effect
const Counter = ({ targetValue, duration = 2000 }: { targetValue: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  return <span>{count}</span>;
};

const About = () => {
  const stats = [
    { icon: Users, numericValue: 500, suffix: "+", label: "Placements" },
    { icon: Target, numericValue: 20, suffix: "+", label: "Clients" },
    { icon: Award, numericValue: 5, suffix: "+", label: "Years" },
    { icon: TrendingUp, numericValue: 98, suffix: "%", label: "Satisfaction" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
              About Menokraft Services
            </h1>
            <p className="text-primary-foreground/70 mt-2 max-w-lg">
              Developing professionals and empowering businesses across Africa
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                  About Menokraft
                </p>
                <h2 className="text-3xl font-extrabold text-foreground mb-6">
                  Developing Professionals Across Africa
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Menokraft Services Ltd is a Lagos-based human capital company dedicated to bridging the gap between exceptional talent and forward-thinking organizations across Nigeria and beyond.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We aim to continuously partner with businesses to render professional services that meet your business needs. We are committed to setting a new standard of training and HR practice across Sub-Saharan Africa.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With deep expertise in HR, outsourcing, corporate training, and management consulting, we deliver tailored solutions that drive real business outcomes.
                </p>
              </div>
              <div>
                <div className="bg-muted/50 rounded-lg p-8 mb-6">
                  <h2 className="text-3xl font-extrabold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To provide excellent, innovative, and client-focused HR, training, and consultancy services that empower businesses to achieve sustainable growth and workforce excellence.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-8">
                  <h2 className="text-3xl font-extrabold text-foreground mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To provide excellent, innovative, and client-focused HR, training, and consultancy services that empower businesses to achieve sustainable growth and workforce excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Full-Width Statistics Section */}
        <section className="py-16 bg-muted/20">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center"
                >
                  <stat.icon size={32} className="text-accent mb-3" />
                  <div className="text-3xl md:text-4xl font-extrabold text-accent mb-1 flex items-center justify-center">
                    <Counter targetValue={stat.numericValue} />
                    {stat.suffix}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;