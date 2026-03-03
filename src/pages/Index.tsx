import HeroSection from "@/components/HeroSection";
import CountdownTimer from "@/components/CountdownTimer";
import WelcomeMessage from "@/components/WelcomeMessage";
import EventDetails from "@/components/EventDetails";
import RSVPForm from "@/components/RSVPForm";
import PhotoGallery from "@/components/PhotoGallery";
import WeddingFooter from "@/components/WeddingFooter";
import AppFooter from "@/components/AppFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <CountdownTimer />
      <WelcomeMessage />
      <EventDetails />
      <RSVPForm />
      <PhotoGallery />
      <WeddingFooter />
      <AppFooter />
    </div>
  );
};

export default Index;
