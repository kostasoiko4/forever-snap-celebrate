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
      Άνοιγμα στο Google Maps
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
          <p className="font-body text-xs tracking-[0.25em] text-muted-foreground mb-4">
            Λεπτομέρειες
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            Πού & Πότε
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <EventCard
            icon={<Church size={22} />}
            title="Η τελετή"
            time="18.00"
            venue="Ιερός ναός Αγίου Θεράποντα"
            address="Κιλκίς 611 00"
            mapsUrl="https://www.google.com/maps/dir//Saint+Therapontas,+%CE%A0%CE%B1%CF%80%CE%B1%CE%B3%CE%B9%CE%B1%CE%BD%CE%BD%CE%AC%CE%BA%CE%BF%CF%85,+%CE%94%CE%B7%CE%BC%CE%AC%CF%81%CF%87%CE%BF%CF%85+%CE%9D%CE%AF%CE%BA%CE%BF%CF%85+%CE%91%CE%B3%CE%B3%CE%B5%CE%BB%CE%AF%CE%B4%CE%B7+%CE%B3%CF%89%CE%BD%CE%AF%CE%B1,+Kilkis+611+00/@41.0031237,22.8773862,17z/data=!4m17!1m7!3m6!1s0x14a9c58d65060c99:0x67030625a56b1681!2sSaint+Therapontas!8m2!3d41.0031197!4d22.8799611!16s%2Fg%2F1pwfb66c_!4m8!1m0!1m5!1m1!1s0x14a9c58d65060c99:0x67030625a56b1681!2m2!1d22.8800267!2d41.0031187!3e0?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
            delay={0.1}
          />
          <EventCard
            icon={<GlassWater size={22} />}
            title="Η δεξίωση"
            time="19:30 - μέχρι το ξυμέρωμα"
            venue="Κτήμα των Ευχών"
            address="Κωνσταντίνου Καραμανλή Αρχή, Κιλκίς 611 00"
            mapsUrl="https://www.google.com/maps/dir//%CE%9A%CF%84%CE%AE%CE%BC%CE%B1+%CF%84%CF%89%CE%BD+%CE%95%CF%85%CF%87%CF%8E%CE%BD,+%CE%9A%CF%89%CE%BD%CF%83%CF%84%CE%B1%CE%BD%CF%84%CE%AF%CE%BD%CE%BF%CF%85+%CE%9A%CE%B1%CF%81%CE%B1%CE%BC%CE%B1%CE%BD%CE%BB%CE%AE+%CE%91%CF%81%CF%87%CE%AE,+Kilkis+611+00/@40.993974,22.8471149,13125m/data=!3m1!1e3!4m18!1m8!3m7!1s0x14a9c5ed0f8eb6f3:0xa5ad8bdbb6fb5a50!2zzprPhM6uzrzOsSDPhM-Jzr0gzpXPhc-Hz47OvQ!8m2!3d41.0044333!4d22.8844043!15sCh_Ous61zr3PhM-Bzr8gzrTOtc6-zrnOv8-DzrXPic69WiEiH866zrXOvc-Ez4HOvyDOtM61zr7Ouc6_z4POtc-Jzr2SARBjYXRlcmluZ19zZXJ2aWNlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJqYzNaSVFYSlJSUkFC4AEA-gEECAAQPQ!16s%2Fg%2F11c54985gm!4m8!1m0!1m5!1m1!1s0x14a9c5ed0f8eb6f3:0xa5ad8bdbb6fb5a50!2m2!1d22.8844043!2d41.0044333!3e0?entry=ttu&g_ep=EgoyMDI2MDMwMS4xIKXMDSoASAFQAw%3D%3D"
            delay={0.25}
          />
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
