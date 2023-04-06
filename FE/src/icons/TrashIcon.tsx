import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const TrashIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="1.5 1.5 21 21" stroke={color}>
      <Path
        d="M5 6.773h4.2m9.8 0h-4.2m-5.6 0V5.5a1 1 0 011-1h3.6a1 1 0 011 1v1.273m-5.6 0h5.6M6.4 8.59v7.273c0 1.714 0 2.57.547 3.104.546.532 1.426.532 3.186.532h3.734c1.76 0 2.64 0 3.186-.532.547-.533.547-1.39.547-3.104V8.59m-8.4 1.818v5.455m2.8-5.455v5.455m2.8-5.455v5.455"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={'none'}
      />
    </Svg>
  );
};
