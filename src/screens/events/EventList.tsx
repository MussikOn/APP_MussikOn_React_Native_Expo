import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventList from '../../components/features/pages/event/EventList';
import { color_white, bg_white } from '../../styles/Styles';

const EventListScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleEventPress = (event: any) => {
    // Aquí puedes manejar la navegación al detalle del evento
    console.log('Event pressed:', event);
  };

  const handleCreateEvent = () => {
    navigation.navigate('EventRequestWizard' as never);
  };

  return (
    <View style={{ flex: 1 }}>
      <EventList onEventPress={handleEventPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  // No styles needed
});

export default EventListScreen; 