import MapView from "react-native-maps";
import { View,StyleSheet } from "react-native";

export default function Maps() {
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