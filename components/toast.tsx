import React, { useEffect, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  visible: boolean;
  onHide?: () => void;
}

export const Toast = React.forwardRef<any, ToastProps>(
  ({ message, type, duration = 3000, visible, onHide }, ref) => {
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
      if (visible) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onHide?.();
          });
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [visible, slideAnim, duration, onHide]);

    if (!visible) return null;

    const getBackgroundColor = () => {
      switch (type) {
        case 'success':
          return '#10B981';
        case 'error':
          return '#EF4444';
        case 'warning':
          return '#F59E0B';
        case 'info':
          return '#3B82F6';
        default:
          return '#6B7280';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'success':
          return '✓';
        case 'error':
          return '✕';
        case 'warning':
          return '⚠';
        case 'info':
          return 'ℹ';
        default:
          return '•';
      }
    };

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.toast,
            {
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          <Text style={styles.icon}>{getIcon()}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </Animated.View>
    );
  }
);

Toast.displayName = 'Toast';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    color: 'white',
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
