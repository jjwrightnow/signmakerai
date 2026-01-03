import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <Sparkles className="text-primary" size={iconSizes[size]} />
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
