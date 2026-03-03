import { Heart } from "lucide-react";

const WeddingFooter = () => {
  return (
    <footer className="py-12 md:py-16 px-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-10 h-px bg-primary mx-auto mb-8" />
        <p className="font-body text-sm text-muted-foreground mb-4">
          Έχετε ερωτήσεις; Επικοινωνήστε μαζί μας{" "}
          <a href="mailto:annaoikonomou@gmail.com" className="text-primary hover:underline">
            annaoikonomou@gmail.com
          </a>{" "}
          ή{" "}
          <a href="tel:+30697 180 1118" className="text-primary hover:underline">
            697 180 1118
          </a>
        </p>
        <p className="font-serif text-lg text-foreground mb-6">
          Ανυπομονούμε να σας δούμε!
        </p>
        <Heart size={18} className="mx-auto text-blush-dark" fill="currentColor" />
        {/* <p className="mt-6 font-body text-xs text-muted-foreground/60 tracking-wide">
          Άννα & Μελέτης • 14 Σεπτεμβρίου 2026
        </p> */}
      </div>
    </footer>
  );
};

export default WeddingFooter;
