import {bg_dark, bg_primary, bg_white, color_danger, color_success} from "../../../styles/Styles"
import { StyleSheet } from "react-native";

export const ss = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(32, 37, 85, 0)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_Touchable:{
        borderWidth: 2,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewInput:{
      padding:10
      ,backgroundColor:bg_primary
      ,shadowColor:bg_dark
      ,borderRadius:42
      ,elevation:10
      ,margin:10
      ,borderWidth:0.3
    },
    viewCheck:{
      padding:10
      ,backgroundColor:bg_primary
      ,shadowColor:bg_dark
      ,borderRadius:10
      ,elevation:10
      ,margin:15
      ,borderWidth:0.3
    },
    container: {
      width: '95%',
      padding: 20,
      alignItems: 'center',
  
    },
    input: {
      borderWidth: 1,
      borderColor: bg_white,
      borderRadius: 30,
      padding: 12,
      fontSize: 15,
      color:bg_white,
      marginBottom: 1,
      backgroundColor: bg_primary,
      elevation: 1,
      shadowColor: bg_white,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    text: {
      fontSize: 16,
      marginLeft: 15,
      color: bg_white,
    },
    title: { 
      fontSize: 34
      ,fontWeight: 'bold'
      ,marginBottom: 2
      ,color: bg_primary
      ,textAlign:"center"  
    },
    subTitle: { 
      fontSize: 15
      ,fontWeight: 'bold'
      ,marginBottom: 20
      ,color: bg_primary
      ,textAlign:"center"  
    },
    section: {
      backgroundColor: bg_dark,
      borderRadius: 15,
      padding: 10,
      margin: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1,
    },
    message: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#444',
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1,
    },
    btn_alert_outline_success: {
      borderColor: color_success,
      borderRadius: 20,
      borderWidth: 2,
    },
    btn_alert_outline_danger: {
      borderColor: color_danger,
      borderRadius: 20,
      borderWidth: 2,
    },
    text_btn_alert_outline_success: {
      color: color_success,
      fontSize: 17,
    },
    text_btn_alert_outline_danger: {
      color: color_danger,
      fontSize: 17,
    },
    btn_alert: {
      width: '50%',
      padding: 5,
      alignItems: 'center',
      margin: 2,
    },
  });
  