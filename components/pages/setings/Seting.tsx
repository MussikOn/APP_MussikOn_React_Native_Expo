import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, Token } from "../../../utils/DatasTypes";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { bg_primary, s } from "../../styles/Styles";
import { deleteToken, getData, getFirstName } from "../../../utils/functions";
import { useEffect, useState } from "react";
import BottomMenu from "../../BottomMenu";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import AlertModal from "../alerts/AlertModal";
import AnimatedBackground from "../../styles/AnimatedBackground";

// import { DrawerContentScrollView } from "@react-navigation/drawer";

type Props = StackScreenProps<RootStackParamList, "Seting">;

const Seting: React.FC<Props> = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const [userData, setUserData] = useState<Token>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [opens, setOpens] = useState(false);

  const getDataUser = async () => {
    const data = await getData();
    if (!data) {
      alert("No hay data");
    } else {
      setUserData(data!);
      const name = await getFirstName(data.name);
      setFirstName(name);
      const LastName = await getFirstName(data.lastName);
      setLastName(LastName);
    }
  };
  const closeSesion = async () => {
    deleteToken();
    navigation.replace("Home");
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <>
      <AnimatedBackground />
      <ScrollView style={[s.container_child_scrollView]}>
        <AlertModal
          icon={5}
          message="Esta Seguro que Desea cerrar sesion?"
          title="Cerrar Sesión?"
          visible={opens}
          onConfim={() => closeSesion()}
          btnTxtConfirm="Cerrar Sesión"
          confirmText="Cancelar"
          onClose={() => setOpens(false)}
        ></AlertModal>
        <View style={{ paddingTop: headerHeight, paddingBottom: 60 }}>
          <Text style={styles.title}>Ajustes</Text>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => alert("Perfil")}
            >
              <Ionicons name="person-outline" size={24} color={bg_primary} />
              <Text style={styles.text}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => alert("Notificaciones")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={bg_primary}
              />
              <Text style={styles.text}>Notificaciones</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => alert("Cambiar Contraseña")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={bg_primary}
              />
              <Text style={styles.text}>Cambiar Contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => alert("Tema")}>
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={bg_primary}
              />
              <Text style={styles.text}>Tema</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => setOpens(true)}
            >
              <Ionicons name="exit-outline" size={24} color="red" />
              <Text style={[styles.text, { color: "red" }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomMenu
        onHomePress={() => navigation.navigate("HomePage")}
        onProfilePress={() => alert("Perfil")}
        onSettingsPress={() => alert("Ajustes")}
      ></BottomMenu>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: bg_primary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
});

export default Seting;
