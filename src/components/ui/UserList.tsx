import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { User } from '@appTypes/DatasTypes';
import { URL_API } from '@utils/ENV';
import { useTranslation } from 'react-i18next';

const UserList = ({children}:any) => {
  const { t } = useTranslation();
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
      <Text style={styles.title}>{t('home.names')}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.name?.toString() || item.userEmail}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{t('home.names')}: {item.name} {item.name}</Text>
            <Text style={styles.text}>{t('home.lastnames')}: {item.lastName}</Text>
            <Text style={styles.text}>{t('home.email')}: {item.userEmail}</Text>
            <Text style={styles.text}>{t('home.role')}: {item.roll}</Text>
            <Text style={styles.text}>{t('userlist.created_at')}: {item.create_at}</Text>
            <Text style={styles.text}>{t('userlist.updated_at')}: {item.update_at}</Text>
            <Text style={styles.text}>{t('userlist.deleted_at')}: {item.delete_at}</Text>
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
