import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RSVPForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    attending: "yes",
    guests: "1",
    dietary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("rsvps").insert({
        name: form.name.trim(),
        attending: form.attending === "yes",
        guest_count: parseInt(form.guests),
        dietary_restrictions: form.dietary.trim() || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "RSVP submitted! Thank you ❤️" });
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 md:py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <p className="text-5xl mb-4">💌</p>
          <h2 className="text-2xl font-serif text-foreground mb-3">Thank You!</h2>
          <p className="font-body text-muted-foreground">
            Your RSVP has been received. We can&apos;t wait to see you!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6" id="rsvp">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Kindly Respond
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">RSVP</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="First & Last Name"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
              Will you attend?
            </label>
            <div className="flex gap-4">
              {[
                { value: "yes", label: "Joyfully Accept" },
                { value: "no", label: "Regretfully Decline" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 text-center py-3 rounded-lg border cursor-pointer font-body text-sm transition-colors ${
                    form.attending === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={opt.value}
                    checked={form.attending === opt.value}
                    onChange={(e) => setForm({ ...form, attending: e.target.value })}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {form.attending === "yes" && (
            <div>
              <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
                Number of Guests
              </label>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
              Dietary Restrictions
            </label>
            <textarea
              value={form.dietary}
              onChange={(e) => setForm({ ...form, dietary: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Any allergies or dietary needs..."
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-full font-body text-sm tracking-wide uppercase hover:bg-sage-dark transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default RSVPForm;
