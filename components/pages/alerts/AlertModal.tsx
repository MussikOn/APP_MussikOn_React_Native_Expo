// components/CustomAlert.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { btn_danger, color_danger, color_success, s } from "../../styles/Styles";

const icons: Record<number, string> = {
  0: "❌",
  1: "⚠️",
  2: "✅",
  3: "⚙️",
  4: "✨",
  5: "📋",
  6: "🔐",
  7: "🧠",
  8: "📦",
  9: "🔧",
  10: "📱",
  11: "🧪",
  12: "🧩",
  13: "🔁",
  14: "🧱",
  15: "📌",
  16: "🗂",
  17: "🛠",
  18: "📅",
  19: "🔗",
  20: "💡",
  21: "🙌",
  22: "🔌",
  23:"🎸",
  24:"🥁",
  25:"⏳",
  26:"📍",
  27:"📞",
  28:"📝",
  29:"🕐",
  30:"💵",
  31:"🎹",
  32:"🎯",
  
};

type Props = {
  visible: boolean;
  icon: number;
  title?: string;
  message: string;
  onClose: () => void;
  onConfim?: () => void;
  btnTxtConfirm?: string;
  confirmText?: string;
  children?: any;
};

const AlertModal: React.FC<Props> = ({
  visible,
  icon,
  title = "Alerta",
  message,
  onClose,
  onConfim,
  confirmText,
  btnTxtConfirm,
  children,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={ss.overlay}>
        <View style={ss.container}>
          <Text style={ss.icon}>{icons[icon]}</Text>
          <Text style={ss.title}>{title}</Text>
          <ScrollView>{children}</ScrollView>
          <Text style={ss.message}>{message}</Text>
          <View style={[s.row]}>
            <TouchableOpacity
              onPress={onClose}
              style={[ss.btn_alert, ss.btn_alert_outline_success]}
            >
              <Text style={ss.text_btn_alert_outline_success}>
                {confirmText || "Ok"}
              </Text>
            </TouchableOpacity>

            {btnTxtConfirm ? (
              <TouchableOpacity
                onPress={onConfim}
                style={[ss.btn_alert, ss.btn_alert_outline_danger]}
              >
                <Text style={[ss.text_btn_alert_outline_danger]}>
                  {btnTxtConfirm}
                </Text>
              </TouchableOpacity>
            ) : (
              ""
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ss = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  icon: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    paddingBottom: 35,
  },
  button: {
    backgroundColor: "#b766ef",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  btn_alert_outline_success: {
    borderBlockColor: "transparent",
    borderColor: color_success,
    borderRadius: 20,
    borderWidth: 2,
  },
  btn_alert_outline_danger: {
    borderBlockColor: "transparent",
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

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AlertModal;
