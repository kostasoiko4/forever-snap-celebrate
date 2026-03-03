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
        <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
          You&apos;re Invited
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
          Join Us in Celebration
        </h2>
        <div className="w-10 h-px bg-primary mx-auto mb-8" />
        <p className="font-body text-base md:text-lg leading-relaxed text-muted-foreground">
          We are so thrilled to invite you to share in our joy as we tie the knot.
          Your presence means the world to us — more than any gift could ever express.
          Come as you are, celebrate with us, and let&apos;s make unforgettable memories together.
        </p>
      </motion.div>
    </section>
  );
};

export default WelcomeMessage;
