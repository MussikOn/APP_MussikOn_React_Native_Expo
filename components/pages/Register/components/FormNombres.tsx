// import React from 'react';
// import { View, Text, TextInput, Pressable, TouchableOpacity, Dimensions } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useHeaderHeight } from '@react-navigation/elements';
// import { bg_primary, bg_white, bg_info } from '../../styles/Styles';

// const { width } = Dimensions.get('window');

// type Props = {
//   nombres: string;
//   apellidos: string;
//   rol: string;
//   onChangeNombres: (value: string) => void;
//   onChangeApellidos: (value: string) => void;
//   onChangeRol: (value: string) => void;
//   onNext: () => void;
//   onFinish: () => void;
// };

// const StepRegister = ({
//   nombres,
//   apellidos,
//   rol,
//   onChangeNombres,
//   onChangeApellidos,
//   onChangeRol,
//   onNext,
//   onFinish,
// }: Props) => {
//   const headerHeight = useHeaderHeight();
//   const [step, setStep] = React.useState(0);
//   const offset = useSharedValue(0);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: offset.value }],
//   }));

//   const selectedRoles = ['Músico', 'Creador de evento', 'Pastor', 'Otro'];

//   const handleRoleSelect = (value: string) => {
//     onChangeRol(value);
//   };

//   const next = () => {
//     offset.value = withTiming(-(step + 1) * width, { duration: 400 });
//     setStep(step + 1);
//     onNext();
//   };

//   return (
//     <LinearGradient
//       colors={[bg_white, bg_info, bg_white]}
//       start={{ x: 0.2, y: 1 }}
//       end={{ x: 0.8, y: 0 }}
//       style={{ flex: 1 }}
//     >
//       <Animated.View
//         style={[
//           {
//             flexDirection: 'row',
//             width: width * 2,
//             paddingTop: headerHeight,
//           },
//           animatedStyle,
//         ]}
//       >
//         {/* Paso 1: Nombres */}
//         <View style={{ width, padding: 20 }}>
//           <Text style={{ fontSize: 28, fontWeight: 'bold', color: bg_primary }}>
//             ¡Bienvenido a MusikOn!
//           </Text>
//           <Text style={{ fontSize: 16, marginTop: 10 }}>
//             Para comenzar, dinos tu nombre completo:
//           </Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Nombres"
//             value={nombres}
//             onChangeText={onChangeNombres}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Apellidos"
//             value={apellidos}
//             onChangeText={onChangeApellidos}
//           />
//           <TouchableOpacity style={styles.button} onPress={next}>
//             <Text style={styles.buttonText}>Siguiente</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Paso 2: Rol */}
//         <View style={{ width, padding: 20 }}>
//           <Text style={{ fontSize: 24, fontWeight: 'bold', color: bg_primary }}>
//             Tipo de cuenta
//           </Text>
//           <Text style={{ marginBottom: 10 }}>
//             ¿Cómo vas a usar MusikOn? Selecciona uno:
//           </Text>

//           {selectedRoles.map((tipo) => (
//             <Pressable
//               key={tipo}
//               onPress={() => handleRoleSelect(tipo)}
//               style={styles.checkboxContainer}
//             >
//               <MaterialIcons
//                 name={rol === tipo ? 'check-box' : 'check-box-outline-blank'}
//                 size={32}
//                 color={bg_primary}
//               />
//               <Text style={{ marginLeft: 10, fontSize: 18 }}>{tipo}</Text>
//             </Pressable>
//           ))}

//           <TouchableOpacity style={styles.button} onPress={onFinish}>
//             <Text style={styles.buttonText}>Registrarse</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const styles = {
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     marginVertical: 10,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: bg_primary,
//     paddingVertical: 14,
//     borderRadius: 14,
//     marginTop: 20,
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: bg_white,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
// };

// export default StepRegister;
