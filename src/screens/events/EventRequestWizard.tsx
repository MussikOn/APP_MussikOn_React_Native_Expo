import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventRequestFormWizard from '../../components/forms/EventRequestFormWizard';
import { color_white, bg_white } from '../../styles/Styles';

const EventRequestWizard: React.FC = () => {
  const navigation = useNavigation();

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSuccess = () => {
    // Navegar a la lista de eventos después de crear exitosamente
    navigation.navigate('EventList' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <EventRequestFormWizard
          onCancel={handleCancel}
          onSuccess={handleSuccess}
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

export default EventRequestWizard; 