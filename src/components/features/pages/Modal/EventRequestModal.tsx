import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
interface DataModalEvents {
    photo?:string;
    name:string;
    address: string;
    eventType:string;
    date:string;
    time:string;
    description:string;
}
interface TypeEventRequestModal {
visible:boolean;
onClose:() => void;
onAccept:()=> void;
onReject:()=> void;
data: DataModalEvents;
}

const screenHeight = Dimensions.get('window').height;

const EventRequestModal: React.FC<TypeEventRequestModal> = ({ visible, onClose, onAccept, onReject, data }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Solicitud de Evento</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#73737a" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <View style={styles.profileContainer}>
              {/* <Image
                source={require('../../../assets/profile_photo.jpeg')} 
                style={styles.profileImage}
              /> */}
              <Text style={styles.profileName}>{data.name}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.text}>{data.address}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Tipo de evento:</Text>
              <Text style={styles.text}>{data.eventType}</Text>
            </View>

            <View style={[styles.infoBlock, styles.row]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.text}>{data.date}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Hora:</Text>
                <Text style={styles.text}>{data.time}</Text>
              </View>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Observaciones:</Text>
              <Text style={styles.text}>{data.description || 'Ninguna'}</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Text style={styles.buttonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxHeight: screenHeight * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004aad',
  },
  scroll: {
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#004aad',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  infoBlock: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#73737a',
    marginBottom: 2,
  },
  text: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#01a652',
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});

export default EventRequestModal;
