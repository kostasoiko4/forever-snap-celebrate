import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

const HeroSection = () => {
  const scrollToPhotobooth = () => {
    document.getElementById("photobooth")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/60" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-4">
          We are getting married!
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-cream mb-6 leading-tight">
          Sarah & James
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mb-6" />
        <p className="font-body text-lg md:text-xl text-cream/90 tracking-wide">
          September 14, 2026
        </p>

        <motion.button
          onClick={scrollToPhotobooth}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 inline-flex items-center gap-2 px-8 py-3 bg-primary/90 text-primary-foreground rounded-full font-body text-sm tracking-wide uppercase hover:bg-primary transition-colors backdrop-blur-sm"
        >
          <Camera size={18} />
          Photobooth & Memories
        </motion.button>
      </motion.div>

      {/* Floating CTA for mobile */}
      <motion.button
        onClick={scrollToPhotobooth}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full shadow-lg font-body text-xs tracking-wide uppercase"
      >
        <Camera size={16} />
        Photos
      </motion.button>
    </section>
  );
};

export default HeroSection;
