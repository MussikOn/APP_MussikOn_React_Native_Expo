import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { User } from '../utils/DatasTypes';
import { URL_API } from '../utils/ENV';


const UserList = ({children}:any) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${URL_API}/getallusers`);
        setUsers(response.data); 
        console.info(response.data)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {children}
      <Text style={styles.title}>Lista de Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.name?.toString() || item.userEmail}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Nombre: {item.name} {item.name}</Text>
            <Text style={styles.text}>Usuario: {item.lastName}</Text>
            <Text style={styles.text}>Email: {item.userEmail}</Text>
            <Text style={styles.text}>Roll: {item.roll}</Text>
            <Text style={styles.text}>Fecha de Creación: {item.create_at}</Text>
            <Text style={styles.text}>Ultima Actualización: {item.update_at}</Text>
            <Text style={styles.text}>Fecha que se eliminó: {item.delete_at}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
});

export default UserList;
