// import React, { useRef, useState, useEffect } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   ScrollView,
//    // puedes usar un checkbox personalizado o un paquete como `react-native-paper`
// } from 'react-native';

// type Props = {
//     visible:boolean;
//     onCancel: () => void;
//     onFinish: () => void;

// }
// const screenWidth = Dimensions.get('window').width;

// const accountTypes = ['Músico', 'Organizador', 'Pastor', 'Evangelista'];

// const DynamicFormModal: React.FC<Props> = ({ visible, onCancel, onFinish }) => {
//   const translateX = useRef(new Animated.Value(-screenWidth)).current;
//   const [showModal, setShowModal] = useState(visible);
//   const [step, setStep] = useState(0);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     accountTypes: [] as string[],
//     email: '',
//     password: '',
//   });

//   useEffect(() => {
//     if (visible) {
//       setShowModal(true);
//       Animated.timing(translateX, {
//         toValue: 0,
//         duration: 700,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(translateX, {
//         toValue: screenWidth,
//         duration: 700,
//         useNativeDriver: true,
//       }).start(() => {
//         setShowModal(false);
//       });
//     }
//   }, [visible]);

//   const handleCheckbox = (type: string) => {
//     setFormData((prev) => {
//       const updated = prev.accountTypes.includes(type)
//         ? prev.accountTypes.filter((t) => t !== type)
//         : [...prev.accountTypes, type];
//       return { ...prev, accountTypes: updated };
//     });
//   };

//   const handleNext = () => {
//     if (step < 2) {
//       setStep(step + 1);
//     } else {
//       // Último paso
//       onFinish?.(formData);
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) setStep(step - 1);
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 0:
//         return (
//           <>
//             <TextInput
//               placeholder="Nombre"
//               value={formData.firstName}
//               onChangeText={(text) => setFormData({ ...formData, firstName: text })}
//             />
//             <TextInput
//               placeholder="Apellido"
//               value={formData.lastName}
//               onChangeText={(text) => setFormData({ ...formData, lastName: text })}
//             />
//           </>
//         );
//       case 1:
//         return (
//           <>
//             <Text>Tipo de Cuenta:</Text>
//             {accountTypes.map((type) => (
//               <View key={type} style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <CheckBox
//                   value={formData.accountTypes.includes(type)}
//                   onValueChange={() => handleCheckbox(type)}
//                 />
//                 <Text>{type}</Text>
//               </View>
//             ))}
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <TextInput
//               placeholder="Correo electrónico"
//               keyboardType="email-address"
//               value={formData.email}
//               onChangeText={(text) => setFormData({ ...formData, email: text })}
//             />
//             <TextInput
//               placeholder="Contraseña"
//               secureTextEntry
//               value={formData.password}
//               onChangeText={(text) => setFormData({ ...formData, password: text })}
//             />
//           </>
//         );
//     }
//   };

//   if (!showModal) return null;

//   return (
//     <Modal transparent visible={showModal} animationType="none">
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Animated.View style={{ width: '90%', transform: [{ translateX }] }}>
//           <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
//             Registro - Paso {step + 1}
//           </Text>

//           {renderStep()}

//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
//             {step > 0 && (
//               <TouchableOpacity onPress={handleBack}>
//                 <Text>Anterior</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity onPress={onCancel}>
//               <Text>Cancelar</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleNext}>
//               <Text>{step === 2 ? 'Finalizar' : 'Siguiente'}</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// export default DynamicFormModal;
