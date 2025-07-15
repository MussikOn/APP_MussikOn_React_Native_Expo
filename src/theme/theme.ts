export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    info: string;
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    border: string;
    notification: string;
    success: string;
    danger: string;
    white: string;
  };
}

const commonColors = {
  primary: '#004aad',
  info: '#62a4ff',
  success: '#28a745',
  danger: '#dc3545',
  white: '#ffffff',
};

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    ...commonColors,
    background: '#F5F5F7',
    card: '#FFFFFF',
    text: '#121212',
    secondaryText: '#666666',
    border: '#EAEAEA',
    notification: commonColors.primary,
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    ...commonColors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    secondaryText: '#A9A9A9',
    border: '#2C2C2C',
    notification: commonColors.info,
  },
};
