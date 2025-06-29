import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AnimatedBackground from "../../styles/AnimatedBackground";
import { bg_dark, bg_primary, bg_white } from "../../styles/Styles";
import { Instruments, StateData } from "./forms/DataStepsShareMusician";
import { RenderItems } from "./forms/DataStepsShareMusicians";

const ShareMusician = ({ navigation }: any) => {
  const [stateData, setStateData] = useState<StateData>({
    instruments: "",
    date: "",
    time: "",
    locatios: "",
    eventType: "",
    musicalStyle: "",
    notes: "",
    next: 0,
  });
  const Components: Record<number, JSX.Element> = {
    0: (
      <RenderItems
        data={Instruments}
        stateData={stateData}
        setStateData={setStateData}
      />
    ),
  };

  return (
    <>
      <ScrollView>
        <AnimatedBackground />
        <View style={{ paddingTop: 50 }}>
          <View style={{ paddingTop: 0, alignItems: "center" }}>
            <Text
              style={{
                color: bg_primary,
                fontSize: 30,
                fontWeight: "900",
                alignContent: "center",
              }}
            >
              Músicos
            </Text>
            <Text
              style={{
                color: bg_primary,
                fontSize: 15,
                fontWeight: "900",
              }}
            >
              {stateData.instruments
                ? `Entendido! necesitas ${stateData.instruments}`
                : "Seleciona el tipo de instrumento"}
            </Text>
          </View>
          <View style={{ paddingTop: 40, alignItems: "center" }}>
           {Components[stateData.next]}
           
            {/* <RenderItems
              data={Instruments}
              stateData={stateData}
              setStateData={setStateData}
            ></RenderItems> */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ShareMusician;
