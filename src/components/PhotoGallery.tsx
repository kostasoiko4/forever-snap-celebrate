import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PhotoItem {
  name: string;
  url: string;
}

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Storage bucket may not exist yet — show empty state
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
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Photobooth
          </h2>
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
            <div className="flex justify-center mb-8">
              <button
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-body text-xs tracking-wide uppercase hover:bg-sage-dark transition-colors"
              >
                <Download size={16} />
                Λήψη όλων ({photos.length})
              </button>
            </div>

            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group break-inside-avoid rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
                  <button
                    onClick={() => handleDownload(photo)}
                    className="absolute bottom-3 right-3 p-2 bg-foreground/70 text-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <Download size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default PhotoGallery;
