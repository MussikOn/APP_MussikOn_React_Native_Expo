// RootStackParamList define los nombres de las rutas principales del stack y tabs.
// Usa nombres en inglés y consistentes con el TabNavigator y el sidebar.
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  ShareMusician: undefined;
  MyRequestsList: undefined;
  EditRequest: { requestId: string };
  Profile: undefined;
  Settings: undefined;
  Maps: undefined;
};



export type Token = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
}

export type User = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
      create_at:string;
      update_at:string;
      delete_at:string;
      status:boolean;
    };