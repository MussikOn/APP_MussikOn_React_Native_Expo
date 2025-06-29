import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { useSocket } from "../hooks/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Token } from "../utils/DatasTypes";


const UseSocket = () => {
  const [user, setUser] = useState<Token | null>(null);
  useEffect(()=>{
    const DataUser = async () =>{
      const token = await AsyncStorage.getItem("token");
      if(token){
        const decode:Token = jwtDecode(token);
        console.info(decode);
        return decode;
      }else{
        return undefined;
      }
    }

    async function RegisterSocket(){
      const decode = await DataUser();
      if(decode){ 
        setUser(decode);
        console.info("Decode en el if de la linea 26");
        console.info(decode)
      }       
    }
    console.info("11. Paso.");    RegisterSocket();
  },[]);


  const { notifications, sendNotification } = useSocket(`1`);// ID de usuario emisor
  console.info(`Valor del user.id: ${user}`)
  const [targetUserId, setTargetUserId] = useState("1"); // ID de usuario receptor
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        📬 Notificaciones:
      </Text>

      {/* Lista de Notificaciones */}
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: "#ddd", marginBottom: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      {/* Botón para enviar notificación a otro usuario */}
      <Button
        title="Enviar Notificación"
        onPress={() => sendNotification(targetUserId, "Hola!", "¡Tienes un nuevo mensaje!")}
      />
    </View>
  );
};

export default UseSocket;
