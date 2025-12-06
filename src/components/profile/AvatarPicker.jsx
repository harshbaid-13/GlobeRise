import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

// Predefined avatars (10-20 options)
const AVATARS = [
  { id: 1, emoji: '😀', name: 'Happy' },
  { id: 2, emoji: '😎', name: 'Cool' },
  { id: 3, emoji: '🤩', name: 'Star' },
  { id: 4, emoji: '😊', name: 'Smile' },
  { id: 5, emoji: '🥳', name: 'Party' },
  { id: 6, emoji: '😇', name: 'Angel' },
  { id: 7, emoji: '🤗', name: 'Hug' },
  { id: 8, emoji: '😌', name: 'Relieved' },
  { id: 9, emoji: '🤓', name: 'Nerd' },
  { id: 10, emoji: '😋', name: 'Yum' },
  { id: 11, emoji: '🤔', name: 'Thinking' },
  { id: 12, emoji: '😏', name: 'Smirk' },
  { id: 13, emoji: '😍', name: 'Love' },
  { id: 14, emoji: '🥰', name: 'Adore' },
  { id: 15, emoji: '😘', name: 'Kiss' },
  { id: 16, emoji: '😗', name: 'Whistle' },
  { id: 17, emoji: '😙', name: 'Kiss Smile' },
  { id: 18, emoji: '😚', name: 'Kiss Eyes' },
  { id: 19, emoji: '🙂', name: 'Slight Smile' },
  { id: 20, emoji: '😃', name: 'Big Smile' }
];

const AvatarPicker = ({ selectedAvatar, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (avatar) => {
    onSelect(avatar.emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-24 rounded-full bg-[#222831] border-2 border-[#00ADB5] flex items-center justify-center text-4xl hover:border-[#00D9E8] transition-colors cursor-pointer"
      >
        {selectedAvatar ? (
          <span>{selectedAvatar}</span>
        ) : (
          <FaUser className="text-gray-400 text-3xl" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-[#393E46] border border-[#4b5563] rounded-lg p-4 shadow-xl z-20 w-80">
            <h3 className="text-white font-semibold mb-3">Select Avatar</h3>
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => handleSelect(avatar)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform ${
                    selectedAvatar === avatar.emoji
                      ? 'ring-2 ring-[#00ADB5] bg-[#00ADB5]/20'
                      : 'hover:bg-[#222831]'
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarPicker;

