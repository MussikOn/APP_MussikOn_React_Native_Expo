import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { useSocket } from '../../hooks/useSocket';
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Token } from '@appTypes/DatasTypes';
import { useTranslation } from 'react-i18next';


const UseSocket = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<Token | null>(null);
  useEffect(()=>{
    const DataUser = async () =>{
      const token = await SecureStore.getItemAsync("token");
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


  const socketResult = useSocket(user ? user.userEmail : undefined);
  const notifications = socketResult?.notifications || [];
  const sendNotification = socketResult?.sendNotification || (() => {});
  console.info(`Valor del user.id: ${user}`)
  const [targetUserId, setTargetUserId] = useState("1"); // ID de usuario receptor
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {t('notifications.title')}
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
        title={t('notifications.send_button')}
        onPress={() => sendNotification(targetUserId, t('notifications.hello'), t('notifications.new_message'))}
      />
    </View>
  );
};

export default UseSocket;
