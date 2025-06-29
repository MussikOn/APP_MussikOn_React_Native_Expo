import { View, Text,StyleSheet, Pressable } from "react-native";
import { useState } from "react";
interface Props{
    label:string;
    onPress?: ()=> void;
    onLongPress?: ()=> void;

}

export function FAB({label, onPress,onLongPress }: Props){
    return(
        <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.floatingButton_sum}><Text>{label}</Text></Pressable>
  
    )
}

const styles = StyleSheet.create({
    floatingButton_sum:{
        position:"absolute",
        top:30,
        // right:10,
        backgroundColor:"#65558f",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:15,
        shadowColor:"#000",
        shadowOffset:{width:0, height:4},
        shadowOpacity:0.3,
        elevation:3,
        shadowRadius:4
      },
})