import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { socket } from '@utils/socket';
import { Ionicons } from "@expo/vector-icons";
import { bg_primary, bg_success } from '@styles/Styles';
import { getData } from '@utils/functions';
import { Token, User } from '@appTypes/DatasTypes';
import { useEffect, useState } from "react";
import { useUser } from '@contexts/UserContext';

export const SocketConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Token>();
  const { user } = useUser();

  useEffect(() => {
    const getDatausers = async () => {
      const datas = await getData();
      if (datas) {
        setData(datas);
      }
    };
    getDatausers();
  }, []);


  useEffect(() => {
    if (!data || user?.roll !== 'musico') return;
  
    const onConnect = () => {
      console.info(`Usuario conectado: ${socket.id}`);
      setConnected(true);
      setLoading(false);
      socket.emit("register", data.userEmail);
    };
  
    const handleDisconnect = () => {
      console.info(`Usuario desconectado: ${socket.id}`);
      setConnected(false);
      setLoading(false);
    };
  
    const onNotification = (userData: any) => {
      alert(`Notificación recibida:\n${JSON.stringify(userData, null, 2)}`);
      console.info(`Notificación recibida:\n${JSON.stringify(userData, null, 2)}`);
    };
  
    socket.on("connect", onConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", onNotification); 
  
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", onNotification); 
    };
  }, [data, user]);

  if (user?.roll !== 'musico') return null;

  return (
    <Pressable
    onPress={
      !connected
        ? () => {
            if (!data?.userEmail) {
              alert("Usuario no cargado aún. Intenta de nuevo.");
              return;
            }
            setLoading(true);
            socket.connect();
          }
        : () => {
            setLoading(true);
            socket.disconnect();
          }
    }
    
      style={{
        backgroundColor: connected ? bg_success : bg_primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        marginBottom: 20,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons
            name={connected ? "radio" : "cloud-outline"}
            size={24}
            color="#fff"
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              marginLeft: 10,
            }}
          >
            {connected ? "Conectado" : "Conectar Socket"}
          </Text>
        </>
      )}
    </Pressable>
  );
};
