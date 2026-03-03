import { motion } from "framer-motion";
import { Church, GlassWater, MapPin, Clock } from "lucide-react";

interface EventCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  delay?: number;
}

const EventCard = ({ icon, title, time, venue, address, mapsUrl, delay = 0 }: EventCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="bg-card rounded-lg p-8 md:p-10 text-center border border-border"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-light text-sage-dark mb-6">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-4">{title}</h3>
    <div className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm mb-2">
      <Clock size={14} />
      {time}
    </div>
    <p className="font-serif text-base text-foreground mb-1">{venue}</p>
    <p className="font-body text-sm text-muted-foreground mb-6">{address}</p>
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-body text-xs tracking-wide uppercase hover:bg-sage-dark transition-colors"
    >
      <MapPin size={14} />
      Open in Google Maps
    </a>
  </motion.div>
);

const EventDetails = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
            The Details
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            When & Where
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <EventCard
            icon={<Church size={22} />}
            title="The Ceremony"
            time="5:00 PM"
            venue="Holy Trinity Church"
            address="123 Chapel Lane, Meadowbrook, CA 90210"
            mapsUrl="https://maps.google.com/?q=Holy+Trinity+Church"
            delay={0.1}
          />
          <EventCard
            icon={<GlassWater size={22} />}
            title="The Reception"
            time="7:30 PM until late"
            venue="The Grand Estate Venue"
            address="456 Garden Drive, Meadowbrook, CA 90210"
            mapsUrl="https://maps.google.com/?q=The+Grand+Estate+Venue"
            delay={0.25}
          />
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
