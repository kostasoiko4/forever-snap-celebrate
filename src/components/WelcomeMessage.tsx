import { motion } from "framer-motion";

const WelcomeMessage = () => {
  return (
    <section className="py-16 md:py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="font-body text-xs tracking-[0.25em] text-muted-foreground mb-6">
          Είστε καλεσμένοι
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
          Γιορτάστε μαζί μας
        </h2>
        <div className="w-10 h-px bg-primary mx-auto mb-8" />
        <p className="font-body text-base md:text-lg leading-relaxed text-muted-foreground">
          Με μεγάλη μας χαρά σας προσκαλούμε να μοιραστείτε τη χαρά μας καθώς παντρευόμαστε.
          Η παρουσία σας σημαίνει τα πάντα για εμάς — περισσότερο από όσο θα μπορούσε ποτέ να εκφράσει οποιοδήποτε δώρο.
          Ελάτε όπως είστε, γιορτάστε μαζί μας και ας δημιουργήσουμε μαζί αξέχαστες αναμνήσεις.
        </p>
      </motion.div>
    </section>
  );
};

export default WelcomeMessage;
