import { Badge } from '@/components/ui/badge';
import brainLogo from '@/assets/brain-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBeta?: boolean;
}

export function Logo({ size = 'md', showBeta = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <img 
          src={brainLogo} 
          alt="SignMaker.ai Logo" 
          width={iconSizes[size]} 
          height={iconSizes[size]}
          className="object-contain"
        />
        <span className={`font-semibold tracking-tight ${sizeClasses[size]}`}>
          SignMaker<span className="text-primary">.ai</span>
        </span>
      </div>
      {showBeta && (
        <Badge variant="outline" className="text-xs font-medium border-primary/50 text-primary">
          BETA
        </Badge>
      )}
    </div>
  );
}
