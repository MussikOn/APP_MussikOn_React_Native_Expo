import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/DatasTypes";
import { s } from "./styles/Styles";
import { validateToken } from "../utils/functions";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "react-native-gesture-handler";
import ReelsScreen from "./pages/reels/MainReels";
import MapViewScreen from "./Home/Maps/MapViewScreen";
import AnimatedBackground from "./styles/AnimatedBackground";



type Props = StackScreenProps<RootStackParamList, 'Home'>;


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dataToken, useDataToken]  = useState<string[]>([]);
  const [img, setImg] = useState("https://musikon-media.c8q1.va03.idrivee2-84.com/musikon-media/1744826998680_Logo_app.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=une5qsW31Zlf7yi1lF34%2F20250417%2FVirginia%2Fs3%2Faws4_request&X-Amz-Date=20250417T102557Z&X-Amz-Expires=300&X-Amz-Signature=053847fd5e68a17aa7f5f09e7e26d777a8727b31c00f694edd5269aa788894d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject");

  const  HandleToken  = async () =>{
    const tk = await validateToken();
    if(tk){
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    }
  }
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    HandleToken();
  },[navigation.addListener]);

  return (
   <ScrollView>
     <AnimatedBackground/>
    {/* <ReelsScreen></ReelsScreen> */}
     <View style={[s.container,{paddingTop:headerHeight,paddingBottom:60}]}>
  
  {/* Logo y título */}
<Animated.View style={[s.header, { opacity: fadeAnim }]}>
<Image source={require("../assets/Logo_app.png")} style={s.logo}/>
<Text style={s.title}>Bienvenido a MusikOn</Text>
<Text style={s.subtitle}>Conéctate con músicos y eventos en vivo</Text>
</Animated.View>

{/* Botones de navegación */}
<Animated.View style={[s.buttonContainer, { opacity: fadeAnim }]}>
<TouchableOpacity style={[s.btn, s.btn_primary]} onPress={() => navigation.navigate("Home")}>
<Text style={s.btnText}>Explorar Eventos</Text>
</TouchableOpacity>

<TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => navigation.navigate("Register")}>
<Text style={[s.btnText, s.buttonTextOutline]}>Registrarse</Text>
</TouchableOpacity>
<TouchableOpacity style={[s.btn, s.btn_primary]} onPress={() => navigation.navigate("Login")}>
<Text style={s.btnText}>Iniciar sesión</Text>
</TouchableOpacity>
</Animated.View>
</View>
{/* <MapViewScreen>

</MapViewScreen> */}
   </ScrollView>
  
  );
};



export default HomeScreen;


