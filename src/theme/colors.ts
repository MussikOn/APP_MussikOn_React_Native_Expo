export const colors = {
  // Primary Colors (Azul principal)
  primary: {
    50: '#e6f0fa',
    100: '#cce0f5',
    200: '#99c2eb',
    300: '#66a3e1',
    400: '#3385d7',
    500: '#014aad', // Color principal
    600: '#013e94',
    700: '#01337a',
    800: '#012760',
    900: '#001b47',
  },
  
  // Secondary Colors (Gris oscuro a negro)
  secondary: {
    50: '#f1f1f1',
    100: '#e2e2e2',
    200: '#cccccc',
    300: '#b3b3b3',
    400: '#8c8c8c',
    500: '#444444',
    600: '#222222',
    700: '#111111',
    800: '#080808',
    900: '#000000', // Negro puro
  },
  
  // Accent Colors (Azul claro y blanco)
  accent: {
    50: '#f1f1f1', // Blanco sucio
    100: '#e6f4ff',
    200: '#b3e0ff',
    300: '#80ccff',
    400: '#4db8ff',
    500: '#1aa3ff',
    600: '#008ae6',
    700: '#006bb3',
    800: '#004d80',
    900: '#00334d',
  },
  
  // Neutral Colors (Escala de grises claros)
  neutral: {
    50: '#f9f9f9',
    100: '#f1f1f1', // Fondo claro principal
    200: '#e5e5e5',
    300: '#cccccc',
    400: '#b3b3b3',
    500: '#999999',
    600: '#7f7f7f',
    700: '#666666',
    800: '#4d4d4d',
    900: '#333333',
  },
  
  // Semantic Colors (mantener para consistencia)
  success: {
    50: '#eafaf1',
    100: '#d3f5e3',
    200: '#a7ebc7',
    300: '#7be1ab',
    400: '#4fd78f',
    500: '#23cd73',
    600: '#1ca35c',
    700: '#157944',
    800: '#0e4f2d',
    900: '#072616',
  },
  warning: {
    50: '#fff9e6',
    100: '#fff3cc',
    200: '#ffe699',
    300: '#ffd966',
    400: '#ffcc33',
    500: '#ffbf00',
    600: '#cc9900',
    700: '#997300',
    800: '#664d00',
    900: '#332600',
  },
  error: {
    50: '#fdeaea',
    100: '#fbd3d3',
    200: '#f7a7a7',
    300: '#f37b7b',
    400: '#ef4f4f',
    500: '#eb2323',
    600: '#b81c1c',
    700: '#861515',
    800: '#530e0e',
    900: '#210707',
  },
  
  // Background Colors
  background: {
    primary: '#f1f1f1', // Fondo claro principal
    secondary: '#ffffff',
    tertiary: '#e5e5e5',
    card: '#ffffff',
    overlay: 'rgba(1, 74, 173, 0.08)', // Azul muy suave
  },
  
  // Text Colors
  text: {
    primary: '#000000', // Negro puro
    secondary: '#014aad', // Azul principal para resaltar
    tertiary: '#666666',
    inverse: '#ffffff', // Para fondos oscuros
  },
  
  // Border Colors
  border: {
    primary: '#014aad',
    secondary: '#cccccc',
    accent: '#1aa3ff',
  },
};

// Gradient Presets
export const gradients = {
  primary: ['#014aad', '#00334d'] as const,
  secondary: ['#f1f1f1', '#014aad'] as const,
  accent: ['#1aa3ff', '#014aad'] as const,
  sunset: ['#014aad', '#f1f1f1'] as const,
  ocean: ['#014aad', '#1aa3ff', '#f1f1f1'] as const,
  fire: ['#eb2323', '#ffbf00', '#014aad'] as const,
  cool: ['#e6f4ff', '#f1f1f1'] as const,
  warm: ['#fff3cc', '#f1f1f1'] as const,
  dark: ['#000000', '#014aad'] as const,
  light: ['#ffffff', '#f1f1f1'] as const,
};

// Shadow Presets
export const shadows = {
  small: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#014aad',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#1aa3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
};

export default colors; 