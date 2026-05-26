import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon, Expand } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoItem {
  name: string;
  url: string;
}

const PREVIEW_LIMIT = 6;

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase.storage.from("wedding-photos").list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) throw error;

        const photoItems: PhotoItem[] = (data || [])
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map((file) => {
            const { data: urlData } = supabase.storage.from("wedding-photos").getPublicUrl(file.name);
            return { name: file.name, url: urlData.publicUrl };
          });

        setPhotos(photoItems);
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleDownload = async (photo: PhotoItem) => {
    const response = await fetch(photo.url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = photo.name;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadAll = async () => {
    for (const photo of photos) {
      await handleDownload(photo);
    }
  };

  const previewPhotos = photos.slice(0, PREVIEW_LIMIT);

  return (
    <section id="photobooth" className="py-16 md:py-24 px-6 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] text-muted-foreground mb-4">
            Ζήστε την στιγμή
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Photobooth</h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            Δείτε και κατεβάστε τις φωτογραφίες σας. Νέες φωτογραφίες θα προστήθεντε εδώ κατα την διάρκεια της δεξίωσης!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-lg border border-border"
          >
            <ImageIcon size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="font-serif text-lg text-foreground mb-2">Οι φωτογραφίες έρχονται σύντομα</p>
            <p className="font-body text-sm text-muted-foreground">
              Ελέγξτε ξανά σε λίγο, ο φωτογράφος θέλει λίγη ώρα να επεξεργαστεί τις φωτογραφίες σας!
            </p>
          </motion.div>
        ) : (
          <>
            <Carousel opts={{ align: "start", loop: previewPhotos.length > 1 }} className="px-10">
              <CarouselContent>
                {previewPhotos.map((photo) => (
                  <CarouselItem key={photo.name} className="basis-full sm:basis-1/2 md:basis-1/3">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="relative group block w-full aspect-[3/4] rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                        <Expand
                          size={28}
                          className="text-background opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-body text-xs tracking-wide uppercase hover:bg-sage-dark transition-colors"
              >
                <Expand size={16} />
                Δείτε όλες ({photos.length})
              </button>
              <button
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary rounded-full font-body text-xs tracking-wide uppercase hover:bg-primary/5 transition-colors"
              >
                <Download size={16} />
                Λήψη όλων
              </button>
            </div>
          </>
        )}
      </motion.div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="font-serif text-2xl">Όλες οι φωτογραφίες</h3>
            <p className="text-sm text-muted-foreground">{photos.length} φωτογραφίες</p>
          </div>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {photos.map((photo) => (
              <div
                key={photo.name}
                className="relative group break-inside-avoid rounded-lg overflow-hidden"
              >
                <img src={photo.url} alt={photo.name} className="w-full rounded-lg" loading="lazy" />
                <button
                  onClick={() => handleDownload(photo)}
                  className="absolute bottom-3 right-3 p-2 bg-foreground/70 text-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  aria-label="Download photo"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PhotoGallery;
