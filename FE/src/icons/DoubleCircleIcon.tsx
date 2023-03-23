import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const DoubleCircleIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="0 0 53.538 53.538" stroke={color} strokeWidth={0.695994}>
      <Path
        d="M26.769 0C12.009 0 0 12.008 0 26.769s12.009 26.769 26.769 26.769S53.538 41.53 53.538 26.769C53.537 12.009 41.528 0 26.769 0zm0 50.539C13.663 50.539 3 39.876 3 26.77 3 13.663 13.662 3.001 26.769 3.001S50.538 13.664 50.538 26.77c-.001 13.106-10.663 23.769-23.769 23.769z"
        fill={fill}
      />
      <Path
        d="M26.769 17.561c-5.077 0-9.208 4.131-9.208 9.208s4.131 9.208 9.208 9.208 9.208-4.131 9.208-9.208-4.131-9.208-9.208-9.208zm0 15.417c-3.423 0-6.208-2.785-6.208-6.208s2.785-6.208 6.208-6.208 6.208 2.785 6.208 6.208-2.786 6.208-6.208 6.208z"
        fill={fill}
      />
    </Svg>
  );
};
