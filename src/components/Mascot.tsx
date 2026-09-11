import React from 'react';

type MascotVariant = 'purple' | 'blue' | 'green' | 'red' | 'blue-sitting' | 'blue-reading';

interface MascotProps {
  color: MascotVariant;
  size?: number; // Size in pixels
  className?: string;
  style?: React.CSSProperties;
}

const Mascot: React.FC<MascotProps> = ({ color, size = 150, className = '', style }) => {
  return (
    <div 
      className={`relative inline-block pointer-events-none ${className}`} 
      style={{ width: size, height: size, ...style }}
    >
      <video
        src={`/mascots/${color}.webm`}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default Mascot;
