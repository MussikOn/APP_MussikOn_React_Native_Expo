import React, { useState } from "react";
import { Pressable, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { s, bg_white, appName, bg_primary } from "../../styles/Styles";
import { saveToken } from "../../../utils/functions";
import { RootStackParamList } from "../../../utils/DatasTypes";
import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import { URL_API } from "../../../utils/ENV";
import LoadingModal from "../../LoadingModal";
import AlertModal from "../alerts/AlertModal";
import FormAlertModal from "../alerts/FormAlert";
import {
  label1,
  label2,
  nameRef_1,
  nameRef_2,
  conditionNext,
  Rules,
  subTitle,
  titles,
  isNumeric,
} from "./components/registerStepConfig";

import { ss } from "./components/StepStyle";
import { Data } from "./components/RegisterTypes";
import AnimatedBackground from "../../styles/AnimatedBackground";

type Props = StackScreenProps<RootStackParamList, "Register">;

export interface MainState {
  icon: number;
  titleAlert?: string;
  textAlert?: string;
  viewPass?: boolean;
  viewAlert?: boolean;
  viewModal?: boolean;
  loading?: boolean;
  detone?: boolean;
  sendEmail?: boolean;
  sendCode?: boolean;
  sendPassword?: boolean;
}

const Register: React.FC<Props> = ({ navigation }) => {
  const [next, setNext] = useState(0);
  const [mainState, setMainState] = useState<MainState>({
    icon: 0,
    titleAlert: "!Alerta¡",
    textAlert: "",
    viewPass: true,
    viewAlert: false,
    detone: false,
    viewModal: true,
    loading: false,
    sendEmail: false,
    sendCode: false,
    sendPassword: false,
  });

  const Genero = ["femenino", "masculino"];
  const handleChange = (fieldType: string, inputType: string, text: string) => {
    if (inputType === "number") {
      const numeric = text.replace(/[^0-9]/g, "");
      setStateData((prev) => ({
        ...prev,
        [fieldType]: numeric,
      }));
      return;
    } else if (fieldType === "email" || fieldType === "confirmEmail") {
      const numeric = text.replace(" ", "");
      setStateData((prev) => ({
        ...prev,
        [fieldType]: numeric,
      }));
      return;
    }
    if (text.length > 60) {
      setMainState((prev) => ({
        ...prev,
        icon: 1,
        textAlert: `El campo ${fieldType} es demasiado largo.`,
        viewAlert: true,
      }));
      return;
    } else {
      setStateData((prev) => ({
        ...prev,
        [fieldType]: text,
      }));
    }
  };
  const nexts = () => {
    // if (next > 4) {
    //   setNext(0);
    // }
    setMainState((prev) => ({ ...prev, viewModal: false }));
    setTimeout(() => {
      setNext(next + 1);
      setMainState((prev) => ({ ...prev, viewModal: true }));
    }, 300);
  };
  const back = () => {
    if (next < 0) {
      setNext(0);
    }
    setMainState((prev) => ({ ...prev, viewModal: false }));
    setTimeout(() => {
      setNext(next - 1);
      setMainState((prev) => ({ ...prev, viewModal: true }));
    }, 300);
  };
  const handleSendEmail = async () => {
    setMainState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${URL_API}/auth/authEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: stateData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStateData((prev) => ({
          ...prev,
          params: data.numParam,
        }));
        setMainState((prev) => ({
          ...prev,
          loading: false,
          textAlert: data.msg,
        }));
        nexts();
      } else {
        setMainState((prev) => ({
          ...prev,
          icon: 1,
          loading: false,
          titleAlert: "Correo electrónico Existente!",
          textAlert: data.msg,
          viewAlert: true,
        }));
      }
    } catch (error) {
      setMainState((prev) => ({ ...prev, loading: false }));
      setMainState((prev) => ({
        ...prev,
        textAlert: `Actualmente no puedes registrarte, intentelo mas tarde o pongase en contacto con nosotros 809-858-4001`,
      }));
      setMainState((prev) => ({ ...prev, viewAlert: true }));
    }
  };

  const handleConfirmEmail = async () => {
    setMainState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `${URL_API}/auth/validEmail/${stateData.validCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vaildNumber: stateData.params,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMainState((prev) => ({ ...prev, loading: false }));
        nexts();
      } else {
        setMainState((prev) => ({ ...prev }));
        setMainState((prev) => ({
          ...prev,
          loading: false,
          textAlert: data.msg,
          viewAlert: true,
        }));
        setMainState((prev) => ({ ...prev, viewAlert: true }));
      }
    } catch (error) {
      setMainState((prev) => ({
        ...prev,
        textAlert: `Actualmente no puedes registrarte, intentelo mas tarde o pongase en contacto con nosotros 809-858-4001`,
        loading: false,
        viewAlert: true,
      }));
    }
  };

  const handleRegister = async () => {
    setMainState((prev) => ({ ...prev, loading: false }));

    try {
      const response = await fetch(`${URL_API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: stateData.nombres,
          lastName: stateData.apellidos,
          userEmail: stateData.email,
          userPassword: stateData.password,
          roll: stateData.roll.rol,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMainState((prev) => ({
          ...prev,
          loading: false,
          viewModal: false,
        }));
        await saveToken(data.token);
        console.log("Usuario registrado:", data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        setMainState((prev) => ({
          ...prev,
          loading: false,
          icon: 1,
          textAlert: data.msg,
          viewAlert: true,
        }));
      }
    } catch (error) {
      setMainState((prev) => ({
        ...prev,
        loading: false,
        icon: 1,
        textAlert: `Actualmente no puedes registrarte, intentelo mas tarde o pongase en contacto con nosotros 809-858-4001`,
        viewAlert: true,
      }));
    }
  };
  const [stateData, setStateData] = useState<Data>({
    nombres: "",
    apellidos: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    roll: {
      name: "",
      rol: "",
    },
    validCode: "",
    cValidCode: "",
    params: "",
  });
  const mapTitle = titles(appName, stateData.nombres);
  const mapSubTitle = subTitle(stateData.roll.name, stateData.email);
  const stateDataRef1 = nameRef_1();
  const stateDataRef2 = nameRef_2();
  const mapLabel1 = label1();
  const mapLabel2 = label2();
  const isNumerics = isNumeric();
  const value1 = stateData[stateDataRef1[next] as keyof Data];
  const value2 = stateData[stateDataRef2[next] as keyof Data];
  const detone = conditionNext(stateData)[next]?.();

  const handleNext = () => {
    if (detone.detone) {
      setMainState((prev) => ({ ...prev, icon: detone.icon }));
      setMainState((prev) => ({ ...prev, titleAlert: detone.titleAlert }));
      setMainState((prev) => ({ ...prev, textAlert: detone.textAlert }));
      setMainState((prev) => ({ ...prev, viewAlert: detone.detone }));
    } else if (detone.sendEmail) {
      handleSendEmail();
    } else if (detone.sendCode) {
      handleConfirmEmail();
    } else if (detone.sendPassword) {
      handleRegister();
    } else {
      nexts();
    }
  };

  const handleBack = () => {
    setMainState((prev) => ({ ...prev, viewModal: false }));
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      <AnimatedBackground />
      <ScrollView>
        <LoadingModal visible={mainState.loading!}></LoadingModal>
        <FormAlertModal
          title={mapTitle[next]}
          label1={mapLabel1[next]}
          label2={mapLabel2[next]}
          subTitle={mapSubTitle[next]}
          value1={value1}
          value2={value2}
          onChangeValue1={(e) =>
            handleChange(stateDataRef1[next], isNumerics[next], e)
          }
          onChangeValue2={(e) =>
            handleChange(stateDataRef2[next], isNumerics[next], e)
          }
          onNext={() => {
            handleNext();
          }}
          onBack={() => {
            handleBack();
          }}
          visible={mainState.viewModal}
          secureTextEntry={next === 4 ? mainState.viewPass : false}
        >
          {next === 0 ? (
            <ScrollView>
              {Rules.map((rol, i) => (
                <Pressable
                  onPress={() => {
                    setStateData((prev) => ({
                      ...prev,
                      roll: {
                        ...prev.roll,
                        name: rol.name,
                        rol: rol.roll,
                      },
                    }));
                  }}
                  key={i}
                >
                  <View
                    key={i}
                    style={[
                      ss.viewCheck,
                      { alignItems: "center", flexDirection: "row" },
                    ]}
                  >
                    <MaterialIcons
                      name={
                        rol.roll === stateData.roll.rol
                          ? "check-box"
                          : "check-box-outline-blank"
                      }
                      size={30}
                      color={bg_white}
                    />
                    <Text style={[s.title, { color: bg_white, fontSize: 20 }]}>
                      {rol.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          {next === 4 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setMainState((prev) => ({
                    ...prev,
                    viewPass: !mainState.viewPass,
                  }))
                }
              >
                <MaterialIcons
                  name={
                    mainState.viewPass ? "check-box-outline-blank" : "check-box"
                  }
                  size={24}
                  color={bg_primary}
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 8, color: bg_primary }}>
                {!mainState.viewPass
                  ? "Ocultar Contraseña"
                  : "Mostrar Contraseña"}
              </Text>
            </View>
          ) : null}
        </FormAlertModal>
      </ScrollView>
      <AlertModal
        visible={mainState.viewAlert!}
        icon={mainState.icon}
        title={mainState.titleAlert}
        message={mainState.textAlert!}
        onClose={() => setMainState((prev) => ({ ...prev, viewAlert: false }))}
        confirmText="¡Entendido!"
      />
    </>
  );
};

export default Register;
