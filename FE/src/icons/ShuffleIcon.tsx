import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const ShuffleIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="-4.97 -4.97 59.64 59.64"
      stroke={color}
      strokeWidth={0.49700000000000005}>
      <Path
        d="M27 13.85h9v8.964l13.7-9.964L36 2.886v8.964h-9c-7.168 0-13 5.832-13 13 0 6.065-4.935 11-11 11H1a1 1 0 100 2h2c7.168 0 13-5.832 13-13 0-6.065 4.935-11 11-11zm11-7.036l8.3 6.036-8.3 6.036V6.814zM1 13.85h2c2.713 0 5.318.994 7.336 2.799a.998.998 0 001.412-.078 1 1 0 00-.078-1.412A12.983 12.983 0 003 11.85H1a1 1 0 100 2zM36 35.85h-9a10.99 10.99 0 01-7.278-2.748 1 1 0 10-1.322 1.5 12.988 12.988 0 008.601 3.248h9v8.964l13.7-9.964L36 26.886v8.964zm2-5.036l8.3 6.036-8.3 6.036V30.814z"
        fill={fill}
      />
    </Svg>
  );
};
