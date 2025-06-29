import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { ss } from "../pages/Register/components/StepStyle";

export const OutlineButton = ({
    label,
    color,
    icon,
    onPress,
  }: {
    label: string;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
  }) =>{ 
    return(
    
    <TouchableOpacity
      onPress={onPress}
      style={[ss.btn_Touchable,{
        borderColor: color,
      }]}
    >
      <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
      <Text style={{ color, fontWeight: 'bold' }}>{label}</Text>
    </TouchableOpacity>
  )};