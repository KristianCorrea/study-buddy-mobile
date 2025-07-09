import { Video as LucideIcon } from 'lucide-react-native';

interface IconProps {
  name: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}

export function Icon({ 
  name: IconComponent, 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2, 
  absoluteStrokeWidth = false 
}: IconProps) {
  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
    />
  );
}