import { StyleSheet } from "react-native";
import { colores } from "./media_responsive";

// text comon app
export const appName = "MussikOn";

// Note: These color exports are now deprecated.
// Use the useAppTheme() or useLegacyColors() hooks instead for theme-aware colors.
// These are kept for backward compatibility but will be removed in future versions.

// Colors - DEPRECATED: Use useAppTheme() hook instead
export const color_primary = "#004aad";
export const color_primary_gradient = 'rgba(1, 74, 173, 100)';
export const color_secondary = "#73737a";
export const color_white = "#f1f1f1";
export const color_success = "#a2d6b0";
export const color_danger = "#ff8c8c";
export const color_info = "#5ebeee";

// Buttons colors - DEPRECATED: Use useAppTheme() hook instead
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

// Borders colors - DEPRECATED: Use useAppTheme() hook instead
export const border_color_primary = "#004aad";
export const border_color_secondary = "#73737a";
export const border_color_white = "#f1f1f1";
export const border_color_success = "#01a652";
export const border_color_danger = "#ff8c8c";
export const border_color_info = "#5ebeee";

// Text colors - DEPRECATED: Use useAppTheme() hook instead
export const text_primary = "#004aad";
export const text_secondary = "#73737a";
export const text_white = "#f1f1f1";
export const text_success = "#01a652";
export const text_danger = "#ff8c8c";
export const text_info = "#5ebeee";

// Dynamic background colors
export const bg_dinamic_primary = "#62a4ff";
export const bg_dinamic_info = "#d5effd";

// Base styles that can be used with theme colors
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
      // Note: color should be set dynamically using theme colors
    },
    input_register: {
      borderWidth: 1,
      // Note: borderColor and color should be set dynamically using theme colors
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
    },
    label_register: {
      marginBottom: 5,
      fontWeight: 'bold',
      // Note: color should be set dynamically using theme colors
    },
    picker_register: {
      borderWidth: 1,
      // Note: borderColor and color should be set dynamically using theme colors
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      height: 50,
    },
    // End Register Styles
    // Text Styles - Note: colors should be set dynamically
    text_primary:{
      // color should be set dynamically using theme colors
    },
    text_secondary:{
      // color should be set dynamically using theme colors
    },
    header: {
      alignItems: "center", 
      marginTop: 80,
    },
    logo: {
      width: 180,
      height: 180,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 10,
      // Note: color should be set dynamically using theme colors
    },

    // Form Styles
    form:{
        height:40,
        borderRadius:7
        // Note: borderBlockColor should be set dynamically using theme colors
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
    },
    subtitle: {
      fontSize: 16,
      marginTop: 5,
      textAlign: "center",
      width: 300,
      // Note: color should be set dynamically using theme colors
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
        // backgroundColor should be set dynamically using theme colors
      },  
    btn_danger:{
      // backgroundColor should be set dynamically using theme colors
    },
    btn_outline_primary: {
      backgroundColor: "transparent",
      borderWidth: 2,
      // Note: borderColor should be set dynamically using theme colors
    },
    btn_outline_danger: {
      backgroundColor: "transparent",
      borderWidth: 2,
      // Note: borderColor should be set dynamically using theme colors
    },
    btnText: {
      fontSize: 18,
      fontWeight: "bold",
      // Note: color should be set dynamically using theme colors
    },
    buttonTextOutline: {
      // Note: color should be set dynamically using theme colors
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
        fontWeight: 'bold',
        // Note: color should be set dynamically using theme colors
      },
      box: {
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        // Note: backgroundColor should be set dynamically using theme colors
      }
  });

// Helper function to create themed styles
export const createThemedStyles = (themeColors: any) => {
  return StyleSheet.create({
    // Themed versions of the styles above
    title_register: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: themeColors.text_primary,
    },
    input_register: {
      borderWidth: 1,
      borderColor: themeColors.border_color_primary,
      color: themeColors.text_primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
    },
    label_register: {
      marginBottom: 5,
      fontWeight: 'bold',
      color: themeColors.text_primary,
    },
    picker_register: {
      borderWidth: 1,
      borderColor: themeColors.border_color_primary,
      color: themeColors.text_primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      height: 50,
    },
    text_primary: {
      color: themeColors.text_primary,
    },
    text_secondary: {
      color: themeColors.text_secondary,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 10,
      color: themeColors.color_primary,
    },
    form: {
      height: 40,
      borderBlockColor: themeColors.bg_primary,
      borderRadius: 7,
    },
    subtitle: {
      fontSize: 16,
      color: themeColors.text_primary,
      marginTop: 5,
      textAlign: "center",
      width: 300,
    },
    btn_primary: {
      backgroundColor: themeColors.btn_primary,
    },
    btn_danger: {
      backgroundColor: themeColors.btn_danger,
    },
    btn_outline_primary: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: themeColors.border_color_primary,
    },
    btn_outline_danger: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: themeColors.border_color_primary,
    },
    btnText: {
      color: themeColors.text_white,
      fontSize: 18,
      fontWeight: "bold",
    },
    buttonTextOutline: {
      color: themeColors.text_primary,
    },
    boxText: {
      color: themeColors.text_white,
      fontWeight: 'bold',
    },
    box: {
      backgroundColor: themeColors.color_secondary,
      padding: 20,
      marginBottom: 15,
      borderRadius: 10,
      marginHorizontal: 5,
      alignItems: 'center',
    },
  });
};