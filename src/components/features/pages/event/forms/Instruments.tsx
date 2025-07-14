import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Datos: Record<string, { "iconName": string; "nombre": string }> = {
  0: { "iconName": "musical-notes-outline", "nombre": "Batería" ,},
  1: { "iconName": "musical-notes-outline", "nombre": "Guitarra", },
  2: { "iconName": "musical-notes-outline", "nombre": "Piano", },
  3: { "iconName": "musical-notes-outline", "nombre": "Trompeta", },
};

const ListInstruments = () => {
  const renderItems = () => {
    const items = [];
    for (const key in Datos) {
      if (Datos.hasOwnProperty(key)) {
        items.push(
          <View key={key} style={{ marginBottom: 15, flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={Datos[key].iconName as any} size={24} color="#004aad" />
            <Text style={{ fontSize: 18, marginLeft: 12 }}>{Datos[key].nombre}</Text>
          </View>
        );
      }
    }
    return items;
  };

  return (
  <View 
  style={{ padding: 20 }}>
    {renderItems()}
  </View>);
};

export default ListInstruments;