import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const reelsData = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/500/800?random=1",
    title: "Ensayo en vivo",
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/500/800?random=2",
    title: "Improvisando con el piano",
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/500/800?random=3",
    title: "Clase de tambora 🔥",
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/500/800?random=4",
    title: "Melodías con estilo",
  },
  {
    id: "5",
    imageUrl: "https://picsum.photos/500/800?random=5",
    title: "Reel musical 🎶",
  },
  {
    id: "6",
    imageUrl: "https://picsum.photos/500/800?random=6",
    title: "Flow en estudio",
  },
  {
    id: "7",
    imageUrl: "https://picsum.photos/500/800?random=7",
    title: "Beat en progreso",
  },
  {
    id: "8",
    imageUrl: "https://picsum.photos/500/800?random=8",
    title: "Arte y armonía",
  },
  {
    id: "9",
    imageUrl: "https://picsum.photos/500/800?random=9",
    title: "Inspiración clásica",
  },
  {
    id: "10",
    imageUrl: "https://picsum.photos/500/800?random=10",
    title: "Producción 🔊",
  },
];

const windowWidth = Dimensions.get("window").width;

const ReelsScreen = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Reels MusikOn</Text>
      <FlatList
        data={reelsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#111",
  },
  image: {
    width: windowWidth - 20,
    height: 400,
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
