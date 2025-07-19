import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getData } from "@utils/functions";
import { Token } from "@appTypes/DatasTypes";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Token>();
  const [roll, setRoll] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getData();
      if (!userData) {
        alert(t('home.no_data'));
        return;
      }
      setData(userData);
      setRoll(userData.roll);
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {data.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{data.name} {data.lastName}</Text>
          <Text style={styles.email}>{data.userEmail}</Text>
          <Text style={styles.bio}>{roll}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('events.create_event')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('navigation.musicians')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('common.rating')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
});

export { Profile };
