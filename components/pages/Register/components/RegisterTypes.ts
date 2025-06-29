
export interface alertDataNexst{
    titleAlert:string;
    textAlert:string;
    btnText?:string;
    detone:boolean;
    validEmail?:boolean;
    
}

export interface Data {
  nombres: string;
  apellidos: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  roll: { rol: string; name: string };
  validCode: string;
  cValidCode: string;
  params: string;
}