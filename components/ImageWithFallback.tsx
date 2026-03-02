import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = 'image',
  fallbackText = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-orange-100 to-yellow-100 flex flex-col items-center justify-center ${className}`}>
        <span className="material-icons-round text-orange-400 text-4xl mb-1">
          {fallbackIcon}
        </span>
        {fallbackText && (
          <span className="text-orange-600 text-xs font-bold">{fallbackText}</span>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

export default ImageWithFallback;
