export interface User {
    id: string;
    nombres: string;
    apellidos: string;
    cedula: string;
    saldo: number;
    create_at: string;
    token: string;
    userName: string;
    userPassword: string;
    userEmail: string;
  }
  
  export interface AuthNavigationProps {
    navigation: {
      navigate: (screen: string) => void;
    };
  }