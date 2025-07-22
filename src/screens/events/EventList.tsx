import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventList from '../../components/features/pages/event/EventList';
import { color_white, bg_white } from '../../styles/Styles';

const EventListScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleEventPress = (eventId: string) => {
    // Aquí se puede navegar a los detalles del evento
    console.log('Evento seleccionado:', eventId);
  };

  const handleCreateEvent = () => {
    navigation.navigate('EventRequestWizard' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <EventList
          onEventPress={handleEventPress}
          onCreateEvent={handleCreateEvent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg_white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default EventListScreen; 