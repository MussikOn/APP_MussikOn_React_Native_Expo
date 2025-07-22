import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { removeNotification } from '@store/slices/notificationsSlice';
import { useTheme } from '@contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const SNACKBAR_HEIGHT = 60;
const ANIMATION_DURATION = 250;
const DISPLAY_DURATION = 3500;

const NotificationSnackbar: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<typeof notifications[0] | null>(null);
  const translateY = useState(new Animated.Value(SNACKBAR_HEIGHT))[0];

  useEffect(() => {
    if (notifications.length > 0 && !current) {
      setCurrent(notifications[0]);
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        handleClose();
      }, DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [notifications, current]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SNACKBAR_HEIGHT,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (current) {
        dispatch(removeNotification(current.id));
      }
      setCurrent(null);
      setVisible(false);
    });
  };

  if (!current) return null;

  let bgColor = theme.colors.primary[500];
  if (current.type === 'success') bgColor = theme.colors.success[500];
  if (current.type === 'error') bgColor = theme.colors.error[500];
  if (current.type === 'info') bgColor = theme.colors.info[500] || theme.colors.primary[500];

  return (
    <Animated.View
      style={[
        styles.snackbar,
        {
          backgroundColor: bgColor,
          transform: [{ translateY }],
          width: width - 32,
          shadowColor: bgColor,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Text style={[styles.text, { color: theme.colors.text.inverse }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {t(current.message)}
      </Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
        <Text style={[styles.closeText, { color: theme.colors.text.inverse }]}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    borderRadius: 12,
    minHeight: SNACKBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    zIndex: 9999,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  closeBtn: {
    marginLeft: 16,
    padding: 4,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default NotificationSnackbar; 