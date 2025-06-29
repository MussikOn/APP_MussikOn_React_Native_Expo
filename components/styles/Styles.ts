import { StyleSheet } from "react-native";
import { colores } from "./media_responsive";

// text comon app

export const appName = " APP MusikOn";
export const bg_dinamic_primary = "#62a4ff";
export const bg_dinamic_info = "#d5effd";

// Colors
export const color_primary = "#004aad";
export const color_primary_gradient = 'rgba(1, 74, 173, 100)';
export const color_secondary = "#73737a";
export const color_white = "#f1f1f1";
export const color_success = "#a2d6b0";
export const color_danger = "#ff8c8c";
export const color_info = "#5ebeee";
// Buttons colors.
export const iconSize = 25;
export const btn_primary = "#004aad";
export const btn_secondary = "#73737a";
export const btn_white = "#f1f1f1";
export const btn_success = "#01a652";
export const btn_danger = "#ff8c8c";
export const btn_info = "#5ebeee";

export const bg_primary = "#004aad";
export const bg_secondary = "#73737a";
export const bg_white = "#f1f1f1";
export const bg_dark = "#000";
export const bg_success = "#01a652";
export const bg_danger = "#ff8c8c";
export const bg_info = "#5ebeee";
// Borders colors
export const border_color_primary = "#004aad";
export const border_color_secondary = "#73737a";
export const border_color_white = "#f1f1f1";
export const border_color_success = "#01a652";
export const border_color_danger = "#ff8c8c";
export const border_color_info = "#5ebeee";

// Text colors.
export const text_primary = "#004aad";
export const text_secondary = "#73737a";
export const text_white = "#f1f1f1";
export const text_success = "#01a652";
export const text_danger = "#ff8c8c";
export const text_info = "#5ebeee";

export const s = StyleSheet.create({
    container_child_scrollView:{
      height:"100%",
      width:"100%"
    },
    container: {
      width:"100%",
      flex: 1,
      padding:0,
      alignItems: "center",
      justifyContent: "space-between",
    },
    // Register Styles.
    container_register: {
      padding: 20,
      flex: 1,
      justifyContent: 'center',
    },
    title_register: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: text_primary,
    },
    input_register: {
      borderWidth: 1,
      borderColor: border_color_primary,
      color: text_primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
    },
    label_register: {
      marginBottom: 5,
      fontWeight: 'bold',
      color: text_primary,
    },
    picker_register: {
      borderWidth: 1,
      borderColor: border_color_primary,
      color: text_primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      height: 50,
      // marginBottom: 20,
      borderBlockColor: bg_primary
    },
    // End Register Styles
    // Text Styles
    text_primary:{
      color:text_primary
    },
    text_secondary:{
      color:text_secondary
    },
    header: {
      alignItems: "center", 
      marginTop: 80,
    },
    logo: {
      width: 120,
      height: 120,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: bg_primary,
      marginTop: 10,
    },

    // Form Styles
    form:{
        height:40,
        borderBlockColor: border_color_primary,
        borderRadius:7
    },
    form_control:{
        width: "94%",
        marginHorizontal:4,
      alignItems: "center",
      marginBottom: 5,
    },
    check:{

    },
    check_content:{

    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    }
    ,
    subtitle: {
      fontSize: 16,
      color: text_primary,
      marginTop: 5,
      textAlign: "center",
      width: 300,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      marginBottom: 50,
    },
    btn: {
      width: "80%",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
      marginBottom: 15,
      elevation: 5,
    },
    btn_alert: {
      width: "80%",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
      marginBottom: 15,
      elevation: 5,
    },
    btn_primary:{
        backgroundColor: btn_primary
      },  
    btn_danger:{
      backgroundColor: btn_danger
    },
    btn_outline_primary: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: border_color_primary,
    },
    btn_outline_danger: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: border_color_primary,
    },
    btnText: {
      color: text_white,
      fontSize: 18,
      fontWeight: "bold",
    },
    buttonTextOutline: {
      color: text_primary,
    },
    wave: {
      width: "100%",
      height: 100,
      position: "relative",
      bottom: 0,
    },
    row:{
        flexDirection:"row"
    },
    col:{width:"100%"},
    col_2:{width:"50%"},
    col_3:{width:"33.3%"},
    col_4:{width:"25%"},
    col_5:{width:"20%"},
    col_6:{width:"16.6%"},
    col_7:{width:"14.28%"},
    col_8:{width:"12.5%"},
    col_9:{width:"11.11%"},
    col_10:{width:"10%"},
    boxText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      box: {
        backgroundColor: '#b766ef',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
      }
  });