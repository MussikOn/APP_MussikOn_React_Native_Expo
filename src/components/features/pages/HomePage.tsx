import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, Token } from '@appTypes/DatasTypes';
import { View,Text, ScrollView, TouchableOpacity } from "react-native";
import { s } from '@styles/Styles';
import { deleteToken, getData, getFirstName } from '@utils/functions';
import { useEffect, useState } from "react";
import AlertModal from '@components/features/pages/alerts/AlertModal';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

// Cambiado el tipo a 'Dashboard' (o 'Home' si corresponde) según RootStackParamList
// type Props = StackScreenProps<RootStackParamList, 'HomePage'>;
type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const HomePage :React.FC<Props> = ({ navigation }) => {
    const headerHeight = useHeaderHeight();
    const { t } = useTranslation();
    const [userData, setUserData] = useState<Token>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [opens, setOpens] = useState(false);

    const getDataUser = async () =>{
        const data = await getData();
        if(!data){
            alert(t('home.no_data'));
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
        // Navegación solo a través del sidebar
    }

    useEffect(()=>{
        getDataUser();
    },[])

    return (
        <>
        <ScrollView style={[s.container_child_scrollView]}>
            <View style={[{paddingTop:headerHeight,paddingBottom:60}]} >
                <Text style={[s.title]}>{t('home.welcome_message', { firstName: userData ? firstName : t('common.loading'), lastName: userData ? lastName : '' })}</Text>
                <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => setAlertVisible(true)}>
                    <Text style={[s.buttonTextOutline]}>{t('home.press_here')}</Text>
                </TouchableOpacity>
                {/* Eliminar botón de cerrar sesión directo, usar solo sidebar */}
            </View>
            <AlertModal
        visible={alertVisible}
        icon={1}
        title={t('home.attention')}
        message={t('home.confirm_continue')}
        onClose={() => setAlertVisible(false)}
        confirmText={t('home.understood')}
      >
       {userData ? 
       <View> 
        <Text>{t('home.names')}: {userData!.name}</Text>
        <Text>{t('home.lastnames')}: {userData!.lastName}</Text>
        <Text>{t('home.email')}: {userData!.userEmail}</Text>
        <Text>{t('home.role')}: {userData!.roll}</Text></View> : ""}
        <Text>{t('home.lorem_ipsum')}</Text>
      </AlertModal>
        </ScrollView>
    </>
    );
}

export default HomePage;