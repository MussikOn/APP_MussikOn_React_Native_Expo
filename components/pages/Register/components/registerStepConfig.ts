import { validarEmail, validarPassword } from "../../../../utils/functions";
import { Data } from "../components/RegisterTypes";
import { MainState } from "../Register";
import { alertDataNexst } from "./RegisterTypes";
const title: string = "!Alerta¡";
export const Rules = [
  {
    roll: "eventCreator",
    name: "Creador de eventos",
  },
  {
    roll: "musico",
    name: "Músico",
  },
  {
    roll: "evangelista",
    name: "Evangelista",
  },
];
export const titles = (appName: string, nombres: string) => {
  const mapTitle: Record<number, string> = {
    0: `¡Hola soy ${appName}!`,
    1: `¡Bienvenido a ${appName}!`,
    2: `¡Que bien ${nombres}!`,
    3: `¡Que bien ${nombres}!`,
    4: `¡Que bien ${nombres}!`,
  };
  return mapTitle;
};

export const subTitle = (roll: string, email: string) => {
  let saludo = ""
  if (roll) {
    saludo = "¡Que Bien! Eres "
  }
  const mapSubTitle: Record<number, string> = {
    0: `¡Que tipo de cuenta quieres!\n${saludo}${roll}`,
    1: "¡Que tal si nos conocemos!\nCual es tu nombre?",
    2: `¡Vamos a conocernos  más!`,
    3: `Ya casi estás dentro! hemos enviado un código a tu dirección de correo electrónico, confírmanos que eres tú. \n\n${email} `,
    4: `Ahora vamos a crear una contraseña segura para proteger tu cuenta.`,
  };
  return mapSubTitle;
};

export const label1 = () => {
  const mapLabel1: Record<number, string> = {
    0: "",
    1: "Nombres",
    2: "Correo Electrónico",
    3: "Código de verificación",
    4: "Contraseña",
  };
  return mapLabel1;
};
export const nameRef_1 = () => {
  const stateDataRef1: Record<number, string> = {
    0: "",
    1: "nombres",
    2: "email",
    3: "validCode",
    4: "password",
  };
  return stateDataRef1;
};
export const nameRef_2 = () => {
  const stateDataRef2: Record<number, string> = {
    0: "",
    1: "apellidos",
    2: "confirmEmail",
    3: "cValidCode",
    4: "confirmPassword",
  };
  return stateDataRef2;
};
export const isNumeric = () => {
  const isNumeric1: Record<number, string> = {
    0: "text",
    1: "text",
    2: "text",
    3: "number",
    4: "text",
  };
  return isNumeric1;
};

export const label2 = () => {
  const mapLabel2: Record<number, string> = {
    0: "",
    1: "Apellidos",
    2: "Confirmar Correo",
    3: "Confirmar Código",
    4: "Confirmar Contraseña",
  };
  return mapLabel2;
};
type Roll = {
  name?: string;
  roll?: string;
}

export const structurData = () => {
  const stateDataNext: Record<number, string | Roll> = {
    1: { name: "roll.name", roll: "roll.rol" },
    2: ""
  }

}
export const conditionNext = (stateData: Data): Record<number, () => MainState> => {
  return {

    0: () => {
      if (stateData.roll.rol === "") {

        return {
          icon:1,
          titleAlert: title,
          textAlert: "Usted debe de seleccionar un opción.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "",
          detone: false,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      }
    },

    1: () => {

      if (stateData.nombres === "" || stateData.apellidos === ""){
        if (stateData.nombres === "") {
          return {
            icon:1,
            titleAlert: title,
            textAlert: "El campo Nombres no puede estar vacío.",
            detone: true,
            sendEmail: false,
            sendCode: false,
            sendPassword: false,
          }
        } else {
          return {
            icon:1,
            titleAlert: title,
            textAlert: "El campo Apellidos no puede estar vacío.",
            detone: true,
            sendEmail: false,
            sendCode: false,
            sendPassword: false,
          }
        }
      } else {
        return {
          icon:1,
          titleAlert: "¡Bien!",
          textAlert: "¡Excelente!",
          detone: false,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      }
    },
    2: () => {
      const email = stateData.email.split(" ");
      if (stateData.email === "") {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "El campo Correo electrónico es obligatorio.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.confirmEmail === "") {

        return {
          icon:1,
          titleAlert: title,
          textAlert: "Confirmar el Correo electrónico es obligatorio.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.email.toLowerCase() !== stateData.confirmEmail.toLowerCase()) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Las direcciones de correo electrónico no coinciden.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if(email.length > 1){
        return {
          icon:20,
          titleAlert: title,
          textAlert: "El correo no puede contener espacios.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      }else if (!validarEmail(stateData.email) || !validarEmail(stateData.confirmEmail)) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Direccón de Correo electrónico no válido.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else {

        return {
          icon:1,
          titleAlert: title,
          textAlert: "",
          detone: false,
          sendEmail: true,
          sendCode: false,
          sendPassword: false,
        }
      }
    },
    3: () => {
      
      if (stateData.validCode === "" || stateData.cValidCode === "") {
        if (stateData.validCode === "") {
          return {
            icon:1,
            titleAlert: title,
            textAlert: "El campo código de verificación es obligatorio.",
            detone: true,
            sendEmail: false,
            sendCode: false,
            sendPassword: false,
          }
        } else {
          return {
            icon:1,
            titleAlert: title,
            textAlert: "Debe confirmar el código",
            detone: true,
            sendEmail: false,
            sendCode: false,
            sendPassword: false,
          }
        }
      } else if (stateData.validCode.length < 6) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Aún faltan números",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.validCode.length > 6) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Hay demasiados números, solo deben de haber 6 dígitos.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.validCode !== stateData.cValidCode){
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Los códigos no coinciden.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "",
          detone: false,
          sendEmail: false,
          sendCode: true,
          sendPassword: false,
        }
      }
    },
    4: () => {
      if (stateData.password === "") {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Es obligatorio crear una contraseña.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.confirmPassword === "") {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Debe de confirmar su contraseña.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (stateData.confirmPassword !== stateData.password) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Las contraseñas no coinciden.",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else if (!validarPassword(stateData.confirmPassword) || !validarPassword(stateData.password)) {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "Contraseña poco segura! debe de contener Mayúsculas, Minúsculas, Números y caracteres especiales..",
          detone: true,
          sendEmail: false,
          sendCode: false,
          sendPassword: false,
        }
      } else {
        return {
          icon:1,
          titleAlert: title,
          textAlert: "",
          detone: false,
          sendEmail: false,
          sendCode: false,
          sendPassword: true,
        }
      }
    },

  }

}


export const conditionBack = (stateData: Data) => {
  const stateDataNext: Record<number, () => void> = {
    0: () => {

      return {
        title: title,
        text: ""
      };
    },
    1: () => {
      return {
        title: title,
        text: ""
      };
    },
  }
}


