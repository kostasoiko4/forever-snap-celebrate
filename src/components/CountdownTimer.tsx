import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WEDDING_DATE = new Date("2026-09-14T17:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = Math.max(WEDDING_DATE - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Μέρες", value: timeLeft.days },
    { label: "Ώρες", value: timeLeft.hours },
    { label: "Λεπτά", value: timeLeft.minutes },
    { label: "Δευτερόλεπτα", value: timeLeft.seconds },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto px-6"
      >
        <p className="text-center font-body text-xs tracking-[0.25em] text-muted-foreground mb-8">
          Μετράμε αντίστροφα για την μεγάλη μας μέρα!
        </p>
        <div className="flex justify-center gap-6 md:gap-10">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <span className="block text-3xl md:text-5xl font-serif text-foreground">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="block mt-1 text-[10px] md:text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownTimer;
