// import MapView from "react-native-maps";
import { View,StyleSheet, Text } from "react-native";
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';


export default function Maps() {
    const { t } = useTranslation();
    let MapView;
    try {
            if(Platform.OS !== 'web'){
                // MapView = () =><Text>Mapa no disponible Para la Web</Text>
                MapView = require('react-native-maps').default;
            }

    } catch (error) {
         MapView = () =><Text>{t('maps.not_available_web')}</Text>
    }
            
            
       
    return <>
        <View style={[styles.container]}>
            <MapView
            style={[styles.map]}

            >

            </MapView>
        </View>
    </>
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent:'center', 

    },
    map:{
        width:'90%',
        height:'80%'
    }
})