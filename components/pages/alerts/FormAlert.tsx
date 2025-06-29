import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  bg_danger,
  bg_dark,
  bg_info,
  bg_primary,
  bg_secondary,
  bg_success,
  bg_white,
  color_danger,
  color_success,
  s,
} from "../../styles/Styles";
import { Data } from "../Register/components/RegisterTypes";

const screenWidth = Dimensions.get("window").width;

type Props = {
  logo?:string;
  title?: string;
  type?: string;
  secureTextEntry?: boolean;
  subTitle?: string;
  visible?: boolean;
  label1?: string;
  label2?: string;
  value1?: string | any;
  value2?: string | any;
  btnNext?: string;
  btnBack?: string;
  btnCancel?: string;
  checks?: Data[];
  children?: any;
  // setStateData: React.Dispatch<React.SetStateAction<Data>>;
  onChangeValue1?: (text: string) => void;
  onChangeValue2?: (text: string) => void;
  onCheck?: () => void;
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
};

const FormAlertModal: React.FC<Props> = ({
  logo,
  title,
  subTitle,
  type,
  secureTextEntry = true,
  visible,
  label1,
  label2,
  value1,
  value2,
  btnNext,
  btnBack,
  btnCancel,
  children,
  onChangeValue1,
  onChangeValue2,
  onNext,
  onBack,
  onCancel,
}) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const [showModal, setShowModal] = useState(visible);
  const [value, setValue] = useState("");
  const handleChange = (text:string) => {
    // Solo números (opcionalmente puedes permitir decimales o negativos si quieres)
    const numeric = text.replace(/[^0-9]/g, '');
    setValue(numeric);
  };
  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(translateX,{
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    // <Modal transparent visible={showModal} animationType="none">
      <ScrollView>
        <View style={ss.overlay}>
          <Animated.View
            style={[ss.container, { transform: [{ translateX }] }]}
          >
            <View style={{ padding: 20 }}>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/Logo_app.png")}
                ></Image>
              </View>

              <Text style={ss.title}>{title}</Text>
              <Text style={ss.subTitle}>{subTitle}</Text>

              {label1 ? (
                <View style={ss.viewInput}>
                  <TextInput
                  
                    placeholder={label1}
                    value={value1}
                    // onChangeText={(e)=> {alert(value1); setStateData((prev)=>({
                    //   ...prev,
                    //   [value1]:e
                    // }))}}
                    onChangeText={onChangeValue1}
                    style={ss.input}
                    placeholderTextColor={bg_secondary}
                    secureTextEntry={secureTextEntry}
                  />
                </View>
              ) : null}

              {label2 ? (
                <View style={ss.viewInput}>
                  <TextInput
                    placeholder={label2}
                    value={value2}
                    onChangeText={onChangeValue2}
                    style={ss.input}
                    placeholderTextColor={bg_secondary}
                    secureTextEntry={secureTextEntry}
                  />
                </View>
              ) : null}

              {children}

              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "120%",
                }}
              >
                {onBack ? (
                  <OutlineButton
                    label={btnBack || "Atrás "}
                    color={bg_primary}
                    icon="arrow-back"
                    onPress={onBack}
                  />
                ) : (
                  ""
                )}

                {onCancel ? (
                  <OutlineButton
                    label={btnCancel || ""}
                    color={bg_primary}
                    icon="close"
                    onPress={onCancel}
                  />
                ) : (
                  ""
                )}

                {onNext ? (
                  <OutlineButton
                    label={btnNext || "Siguiente"}
                    color={bg_primary}
                    icon="arrow-forward"
                    onPress={onNext}
                  />
                ) : null}
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    // </Modal>
  );
};
const OutlineButton = ({
  label,
  color,
  icon,
  onPress,
}: {
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      borderColor: color,
      borderWidth: 2,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <Ionicons name={icon} size={18} color={color} style={{ marginRight: 10 }} />
    <Text style={{ color, fontWeight: "bold" }}>{label}</Text>
  </TouchableOpacity>
);

const ss = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(32, 37, 85, 0)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewInput: {
    padding: 10,
    display: "flex",
    backgroundColor: bg_primary,
    shadowColor: bg_dark,
    borderRadius: 42,
    elevation: 10,
    margin: 10,
    borderWidth: 0.3,
  },
  viewCheck: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: bg_primary,
    shadowColor: bg_dark,
    borderRadius: 10,
    elevation: 10,
    margin: 10,
    borderWidth: 0.3,
  },
  container: {
    width: "95%",
    padding: 20,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: bg_white,
    borderRadius: 30,
    padding: 12,
    fontSize: 15,
    color: bg_white,
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
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 2,
    color: bg_primary,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
    color: bg_primary,
    textAlign: "center",
  },
  section: {
    backgroundColor: bg_dark,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
    borderBottomColor: "#e0e0e0",
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
    width: "50%",
    padding: 5,
    alignItems: "center",
    margin: 2,
  },
});

export default FormAlertModal;
