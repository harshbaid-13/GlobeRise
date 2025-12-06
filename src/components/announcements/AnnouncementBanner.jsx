import { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { FaTimes, FaBullhorn, FaGift, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getActiveAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (ann) => !dismissed.has(ann.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const currentAnnouncement = visibleAnnouncements[currentIndex];

  const getIcon = (type) => {
    switch (type) {
      case 'OFFER':
        return <FaGift className="w-5 h-5" />;
      case 'MAINTENANCE':
        return <FaExclamationTriangle className="w-5 h-5" />;
      default:
        return <FaBullhorn className="w-5 h-5" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'OFFER':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      case 'MAINTENANCE':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
    }
  };

  const handleDismiss = () => {
    setDismissed((prev) => new Set([...prev, currentAnnouncement.id]));
    if (currentIndex < visibleAnnouncements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + visibleAnnouncements.length) % visibleAnnouncements.length
    );
  };

  return (
    <div
      className={`${getBgColor(
        currentAnnouncement.type
      )} text-white rounded-lg p-4 mb-4 relative`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(currentAnnouncement.type)}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1">{currentAnnouncement.title}</h4>
          <p className="text-sm text-white/90 line-clamp-2">
            {currentAnnouncement.content}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {visibleAnnouncements.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                ←
              </button>
              <span className="text-xs">
                {currentIndex + 1} / {visibleAnnouncements.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                →
              </button>
            </>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;

