import {useIsFocused} from '@react-navigation/native';
import {StatusBar} from 'react-native';

const FocusAwareStatusBar = (props: any) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

export default FocusAwareStatusBar;
