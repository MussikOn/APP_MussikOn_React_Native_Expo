import React from 'react';
import { View, StyleSheet } from 'react-native';
import EventList from '../../components/features/pages/event/EventList';
import { useSidebar } from '../../contexts/SidebarContext';

const EventListScreen = () => {
  const { setActiveScreen } = useSidebar();

  const handleEventPress = (event: any) => {
    // Aquí puedes manejar la navegación al detalle del evento
    console.log('Event pressed:', event);
  };

  return (
    <View style={styles.container}>
      <EventList onEventPress={handleEventPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EventListScreen; 