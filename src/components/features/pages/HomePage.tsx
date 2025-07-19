import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, Token } from '@appTypes/DatasTypes';
import { View,Text, ScrollView, TouchableOpacity } from "react-native";
import { s } from '@styles/Styles';
import { deleteToken, getData, getFirstName } from '@utils/functions';
import { useEffect, useState } from "react";
import BottomMenu from '@components/ui/BottomMenu';
import AlertModal from '@components/features/pages/alerts/AlertModal';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

type Props = StackScreenProps<RootStackParamList, 'HomePage'>;

const HomePage :React.FC<Props> = ({ navigation }) => {
    const headerHeight = useHeaderHeight();
    const { t } = useTranslation();
    // alert(headerHeight)
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
                <Text style={[s.title]}>{t('home.welcome_message', { firstName: userData ? firstName : t('common.loading'), lastName: userData ? lastName : '' })}</Text>
                <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => setAlertVisible(true)}>
                    <Text style={[s.buttonTextOutline]}>{t('home.press_here')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.btn_outline_primary]} onPress={() => closeSesion()}>
                    <Text style={[s.buttonTextOutline]}>{t('home.logout')}</Text>
                </TouchableOpacity>
                
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
        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum veniam totam nam, libero nisi ratione magnam quidem provident in veritatis illo obcaecati atque inventore soluta sed aperiam autem vero? Suscipit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At aut quisquam praesentium iste! Laudantium harum aliquid incidunt obcaecati minus eum, eos fugiat voluptates rerum rem sunt consequatur totam provident dolores.</Text>
      </AlertModal>
        </ScrollView>
            <BottomMenu 
            onHomePress={()=> alert(t('home.home'))} 
            onProfilePress={()=>alert(t('home.profile'))} 
            onSettingsPress={()=> navigation.navigate("Seting")} ></BottomMenu>
    </>
    );
}

export default HomePage;