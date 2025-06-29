import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Asegúrate de importar esto
import { StateData, RenderItemsProps } from "../forms/DataStepsShareMusician"; // Ajusta tu ruta si es necesario
import { bg_primary, bg_white, bg_dark } from "../../../styles/Styles"; // Ajusta rutas



export const RenderItems: React.FC<RenderItemsProps> = ({ data, stateData, setStateData }) => {
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      {Object.keys(data).map((key) => (
        <TouchableOpacity
          key={key}
          onPress={() => setStateData((prev) => ({
            ...prev,
            instruments: data[key].nombre,
            next: stateData.next + 1
          }))}
          style={{
            alignItems: "center",
            marginBottom: 15,
            paddingStart:15,
            flexDirection: "row",
            backgroundColor: bg_white,
            width: "90%",
            height: 80,
            borderRadius: 7,
            elevation: 5,
            shadowColor: bg_dark,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
          }}
        >
          <MaterialIcons
            name={data[key].nombre === stateData.instruments ? "check-box" : "check-box-outline-blank"}
            size={35}
            color={bg_primary}
          />
          <Text style={{ fontSize: 35, marginLeft: 12 }}>
            {data[key].icon}
          </Text>
          <Text style={{
            fontSize: 18,
            marginLeft: 12,
            color: bg_primary,
            fontWeight: "500",
          }}>
            {data[key].nombre}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// MyScreens.tsx


export const MyScreens: Record<number, JSX.Element> = {
  0: (
    <View style={{ flex: 1, backgroundColor: "#004aad", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, color: "#fff" }}>Pantalla 1</Text>
    </View>
  ),
  1: (
    <View style={{ flex: 1, backgroundColor: "#b766ef", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, color: "#fff" }}>Pantalla 2</Text>
    </View>
  ),
  2: (
    <View style={{ flex: 1, backgroundColor: "#01a652", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, color: "#fff" }}>Pantalla 3</Text>
    </View>
  ),
};


