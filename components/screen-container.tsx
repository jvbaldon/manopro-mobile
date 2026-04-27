import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface ScreenContainerProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container padrão para todas as telas
 * Aplica safe area insets e background correto
 */
export function ScreenContainer({ className, children, style, ...props }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#F7F6F3',
          paddingTop: insets.top,
        },
        style,
      ]}
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </View>
  );
}
