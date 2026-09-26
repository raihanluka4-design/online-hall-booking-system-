import React from 'react';
import {
  Tv,
  Wind,
  Wifi,
  Volume2,
  Car,
  Armchair,
  Monitor,
  Sparkles,
  Layers,
} from 'lucide-react';

interface FacilityIconProps {
  name: string;
  className?: string;
  showLabel?: boolean;
}

export const FacilityIcon: React.FC<FacilityIconProps> = ({
  name,
  className = 'h-4 w-4',
  showLabel = false,
}) => {
  const lower = name.toLowerCase();

  let IconComponent = Sparkles;

  if (lower.includes('projector') || lower.includes('screen') || lower.includes('tv')) {
    IconComponent = Tv;
  } else if (lower.includes('air') || lower.includes('ac') || lower.includes('conditioning')) {
    IconComponent = Wind;
  } else if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) {
    IconComponent = Wifi;
  } else if (lower.includes('sound') || lower.includes('mic') || lower.includes('audio')) {
    IconComponent = Volume2;
  } else if (lower.includes('parking')) {
    IconComponent = Car;
  } else if (lower.includes('seat') || lower.includes('chair')) {
    IconComponent = Armchair;
  } else if (lower.includes('computer') || lower.includes('pc') || lower.includes('lab')) {
    IconComponent = Monitor;
  } else if (lower.includes('stage') || lower.includes('podium')) {
    IconComponent = Layers;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
      <IconComponent className={className} />
      {showLabel && <span>{name}</span>}
    </span>
  );
};
