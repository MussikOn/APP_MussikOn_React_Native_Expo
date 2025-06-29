import React from "react";
import { View, Image, StyleSheet } from "react-native";

const ImagenRemota = () => {
  const imageUrl =
    "https://musikon-media.c8q1.va03.idrivee2-84.com/musikon-media/1744826998680_Logo_app.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=une5qsW31Zlf7yi1lF34%2F20250417%2FVirginia%2Fs3%2Faws4_request&X-Amz-Date=20250417T112305Z&X-Amz-Expires=300&X-Amz-Signature=689d32a5dbf28ef21effdf810a0fe7491cc0a4c38bef7c9f5138092cd675e88a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

export default ImagenRemota;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});
