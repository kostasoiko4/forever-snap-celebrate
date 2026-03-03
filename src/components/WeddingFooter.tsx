import { Heart } from "lucide-react";

const WeddingFooter = () => {
  return (
    <footer className="py-12 md:py-16 px-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-10 h-px bg-primary mx-auto mb-8" />
        <p className="font-body text-sm text-muted-foreground mb-4">
          Got questions? Reach out to us at{" "}
          <a href="mailto:sarah.james@wedding.com" className="text-primary hover:underline">
            sarah.james@wedding.com
          </a>{" "}
          or{" "}
          <a href="tel:+15551234567" className="text-primary hover:underline">
            (555) 123-4567
          </a>
        </p>
        <p className="font-serif text-lg text-foreground mb-6">
          We can&apos;t wait to celebrate with you!
        </p>
        <Heart size={18} className="mx-auto text-blush-dark" fill="currentColor" />
        <p className="mt-6 font-body text-xs text-muted-foreground/60 tracking-wide">
          Sarah & James • September 14, 2026
        </p>
      </div>
    </footer>
  );
};

export default WeddingFooter;
