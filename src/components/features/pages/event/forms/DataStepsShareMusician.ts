// Data Types
export interface StateData{
  instruments:string;
  date:string;
  time:string;
  locatios:string;
  eventType:string;
  musicalStyle:string;
  notes:string;
  next:number;
}

export interface RenderItemsProps {
  data: any;
  stateData: StateData;
  setStateData: React.Dispatch<React.SetStateAction<StateData>>;
}

export const Instruments: Record<number, { icon: string; nombre: string }> =
  {
    0: { icon: "🥁", nombre: "Batería" },
    1: { icon: "🎸", nombre: "Guitarra" },
    2: { icon: "🎹", nombre: "Piano" },
    3: { icon: "🎸", nombre: "Bajo" },
    
  };



  
