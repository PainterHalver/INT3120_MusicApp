import {createContext, useContext, useRef, useState} from 'react';
import {Animated} from 'react-native';

export type SpinningDiscContextType = {
  rotation: Animated.Value;
  pausedRotationValue: number;
  isRotating: boolean;

  setPausedRotationValue: (pausedRotationValue: number) => void;
  setIsRotating: (isRotating: boolean) => void;
};

const SpinningDiscContext = createContext<SpinningDiscContextType>({
  rotation: new Animated.Value(0),
  pausedRotationValue: 0,
  isRotating: false,
  setPausedRotationValue: () => {},
  setIsRotating: () => {},
});

export const SpinningDiscProvider = ({children}: any) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [pausedRotationValue, setPausedRotationValue] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  return (
    <SpinningDiscContext.Provider
      value={{
        rotation,
        pausedRotationValue,
        isRotating,
        setPausedRotationValue,
        setIsRotating,
      }}>
      {children}
    </SpinningDiscContext.Provider>
  );
};

export const useSpinningDiscContext = () => useContext(SpinningDiscContext);
