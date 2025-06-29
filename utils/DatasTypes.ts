export type RootStackParamList = {
      Login: undefined;
      Home: undefined;
      HandleLogin:undefined;
      Dashboard:undefined;
      UseSocket:undefined;
      Profile:undefined;
      Register:undefined;
      HomePage:undefined;
      Seting:undefined;
      MainTabs:undefined;
};
// export type RootStackParamListTab = {
//       Home: undefined;
//       HandleLogin:undefined;
//       Dashboard:undefined;
//       UseSocket:undefined;
//       Profile:undefined;
//       Register:undefined;
//       HomePage:undefined;
//       Seting:undefined;
    
// };
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