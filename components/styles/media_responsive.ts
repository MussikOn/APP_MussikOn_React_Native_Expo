import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
// import { btn_primary, btn_danger } from './Styles';
const btn_primary = "#004aad";
const btn_danger = "#8b61c2";
const { width, height } = Dimensions.get('window');

export const isSmallScreen = width < 375;
export const colores = isSmallScreen ? btn_primary : btn_danger;

export const media_styles = StyleSheet.create({
  media_color: {
    backgroundColor: isSmallScreen ? btn_primary : btn_danger,
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

});