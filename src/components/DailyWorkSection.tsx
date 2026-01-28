import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play } from 'lucide-react';

interface Video {
  id: string;
  src: string;
  enabled: boolean;
}

const videos: Video[] = [
  { id: '1', src: '/videos/daily-work-1.mp4', enabled: true },
  { id: '2', src: '/videos/daily-work-2.mp4', enabled: true },
  { id: '3', src: '/videos/daily-work-3.mp4', enabled: true },
  { id: '4', src: '/videos/daily-work-4.mp4', enabled: true },
];

function VideoCard({ src, index }: { src: string; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative aspect-[9/16] overflow-hidden bg-muted cursor-pointer group"
      onClick={handlePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        onEnded={handleVideoEnd}
      />
      
      {/* Play overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="bg-foreground/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-foreground/30 transition-colors">
          <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>

      {/* Subtle gradient overlay when not playing */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
}

export function DailyWorkSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const enabledVideos = videos.filter(v => v.enabled);

  return (
    <section className="section-padding bg-secondary" ref={ref}>
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20"
        >
          <span className="font-sans text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground block mb-3">
            {t('dailyWork.label')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            {t('dailyWork.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {enabledVideos.map((video, index) => (
            <VideoCard key={video.id} src={video.src} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-sm md:text-base font-light text-muted-foreground text-center mt-10 md:mt-16 tracking-wide"
        >
          {t('dailyWork.caption')}
        </motion.p>
      </div>
    </section>
  );
}
