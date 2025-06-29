import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, Token} from "../../utils/DatasTypes";
import { View,Text, ScrollView, TouchableOpacity } from "react-native";
import { s } from "../styles/Styles";
import { deleteToken, getData, getFirstName } from "../../utils/functions";
import { useEffect, useState } from "react";
import BottomMenu from "../BottomMenu";
import AlertModal from "./alerts/AlertModal";
import { useHeaderHeight } from '@react-navigation/elements';


type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePage :React.FC<Props> = ({ navigation }) => {
    const headerHeight = useHeaderHeight();
    // alert(headerHeight)
    const [userData, setUserData] = useState<Token>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [opens, setOpens] = useState(false);

    const getDataUser = async () =>{
        const data = await getData();
        if(!data){
            alert("No hay data");
        }else{
            setUserData(data!);
            const name = await getFirstName(data.name);
            setFirstName(name);
            const LastName = await getFirstName(data.lastName);
            setLastName(LastName);
        }
    }
    const closeSesion = async () => { 
        deleteToken();
        navigation.replace("Home");
        
    }

    useEffect(()=>{
        getDataUser();
    },[])

    return (
        <>
        <ScrollView style={[s.container_child_scrollView]}>
         {/* <Sidebar  isVisible={opens} {...userData}> */}
            <View style={[{paddingTop:headerHeight,paddingBottom:60}]} >
                <Text style={[s.title]}>Bienvenido Sr. {userData ? firstName: "Nombre\n"} {userData ? lastName: "Nombre"}</Text>
                <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => setAlertVisible(true)}>
                    <Text style={[s.buttonTextOutline]}>Pesiona Aquí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => closeSesion()}>
                    <Text style={[s.buttonTextOutline]}>Cerrar Sesión</Text>
                </TouchableOpacity>
                
            </View>
            <AlertModal
        visible={alertVisible}
        icon={1}
        title="¡Atención!"
        message="¿Estás seguro que quieres continuar?"
        onClose={() => setAlertVisible(false)}
        confirmText="Entendido"
      >
       {userData ? 
       <View> 
        <Text>Nombres: {userData!.name}</Text>
        <Text>Apellidos: {userData!.lastName}</Text>
        <Text>Correo: {userData!.userEmail}</Text>
        <Text>Roll: {userData!.roll}</Text></View> : ""}
        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum veniam totam nam, libero nisi ratione magnam quidem provident in veritatis illo obcaecati atque inventore soluta sed aperiam autem vero? Suscipit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At aut quisquam praesentium iste! Laudantium harum aliquid incidunt obcaecati minus eum, eos fugiat voluptates rerum rem sunt consequatur totam provident dolores.</Text>
      </AlertModal>
        </ScrollView>
            <BottomMenu 
            onHomePress={()=> alert("Inicio")} 
            onProfilePress={()=>alert("Perfil")} 
            onSettingsPress={()=> navigation.navigate("Seting")} ></BottomMenu>
    </>
    );
}

export default HomePage;
// import { StackScreenProps } from "@react-navigation/stack";
// import { RootStackParamList, Token} from "../../utils/DatasTypes";
// import { View,Text, ScrollView, TouchableOpacity } from "react-native";
// import { s } from "../styles/Styles";
// import { deleteToken, getData, getFirstName } from "../../utils/functions";
// import { useEffect, useState } from "react";
// import BottomMenu from "../BottomMenu";
// import AlertModal from "../AlertModal";
// import { useHeaderHeight } from '@react-navigation/elements';


// type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

// const HomePage :React.FC<Props> = ({ navigation }) => {
//     const headerHeight = useHeaderHeight();
//     // alert(headerHeight)
//     const [userData, setUserData] = useState<Token>();
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [alertVisible, setAlertVisible] = useState(false);
//     const [opens, setOpens] = useState(false);

//     const getDataUser = async () =>{
//         const data = await getData();
//         if(!data){
//             alert("No hay data");
//         }else{
//             setUserData(data!);
//             const name = await getFirstName(data.name);
//             setFirstName(name);
//             const LastName = await getFirstName(data.lastName);
//             setLastName(LastName);
//         }
//     }
//     const closeSesion = async () => { 
//         deleteToken();
//         navigation.replace("Home");
        
//     }

//     useEffect(()=>{
//         getDataUser();
//     },[])

//     return (
//         <>
//         <ScrollView style={[s.container_child_scrollView]}>
//          {/* <Sidebar  isVisible={opens} {...userData}> */}
//             <View style={[{paddingTop:headerHeight,paddingBottom:60}]} >
//                 <Text style={[s.title]}>Bienvenido Sr. {userData ? firstName: "Nombre\n"} {userData ? lastName: "Nombre"}</Text>
//                 <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => setAlertVisible(true)}>
//                     <Text style={[s.buttonTextOutline]}>Pesiona Aquí</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => closeSesion()}>
//                     <Text style={[s.buttonTextOutline]}>Cerrar Sesión</Text>
//                 </TouchableOpacity>
                
//             </View>
//             <AlertModal
//         visible={alertVisible}
//         title="¡Atención!"
//         message="¿Estás seguro que quieres continuar?"
//         onClose={() => setAlertVisible(false)}
//         confirmText="Entendido"
//       >
//        {userData ? 
//        <View> 
//         <Text>Nombres: {userData!.name}</Text>
//         <Text>Apellidos: {userData!.lastName}</Text>
//         <Text>Correo: {userData!.userEmail}</Text>
//         <Text>Roll: {userData!.roll}</Text></View> : ""}
//         <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum veniam totam nam, libero nisi ratione magnam quidem provident in veritatis illo obcaecati atque inventore soluta sed aperiam autem vero? Suscipit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At aut quisquam praesentium iste! Laudantium harum aliquid incidunt obcaecati minus eum, eos fugiat voluptates rerum rem sunt consequatur totam provident dolores.</Text>
//       </AlertModal>
//         </ScrollView>
//             <BottomMenu 
//             onHomePress={()=> alert("Inicio")} 
//             onProfilePress={()=>alert("Perfil")} 
//             onSettingsPress={()=> navigation.navigate("Seting")} ></BottomMenu>
//     </>
//     );
// }

// export default HomePage;