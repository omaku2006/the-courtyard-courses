import { useState } from 'react';
import SystemBase from './SystemBase';
import MagicTextInOut from '../../components/ui/MagicTextInOut';
import { useAppSelector } from '../../app/hooks';

const LoadingPage = () => {
  const loadingMessages: string[] = [
    'Opening the Gates...',
    'Lighting the Courtyard Lamps...',
    'Preparing the Lecture Hall...',
    'Dusting Ancient Manuscripts...',
    'Arranging the Library Shelves...',
    'Summoning the Faculty...',
    'Unlocking the Archives...',
    'Polishing the Brass Lamps...',
    "Brewing the Scholars' Tea...",
    'Awaiting the Headmaster...',
    'Ringing the Bell...',
    'Preparing Your Study...',
    'Gathering Great Minds...',
    'Sharpening the Quills...',
    'Opening the Grand Library...',
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);

  // 🔥 Animation jyare puru thaay tyare j next message
  const handleCycleComplete = () => {
    setMessageIndex((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * loadingMessages.length);
      } while (next === prev && loadingMessages.length > 1);
      return next;
    });
  };

  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <SystemBase>
      <MagicTextInOut
        text={loadingMessages[messageIndex]}
        glowColor="#c9a86a"
        textColor={theme === 'dark' ? '#f7f3ea' : '#3a2b1e'}
        animationDuration={1.5} // 👈 100 nathi, seconds ma chhe!
        holdingDuration={2}
        both={true}
        welding={true}
        onCycleComplete={handleCycleComplete}
      />
    </SystemBase>
  );
};

export default LoadingPage;
