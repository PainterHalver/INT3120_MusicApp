import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

import {IconProps} from './IconProps';

export const AddToPlayingIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="-35 -35 320 320" stroke={color}>
      <Path
        d="M92.375 211.094 64.25 227.332 38 242.487c-13.333 7.698-30-1.924-30-17.32V34.641c0-15.396 16.667-25.018 30-17.32l26.25 15.155 28.125 16.238M260 127c0 41.421-33.579 75-75 75s-75-33.579-75-75 33.579-75 75-75 75 33.579 75 75Z"
        stroke="#000"
        strokeWidth={14}
        fill="none"
      />
      <Path d="M177 97.3a8.3 8.3 0 1 1 16.6 0v60.4a8.3 8.3 0 1 1-13.6 0V97.3Z" fill="#000" />
      <Rect
        x={147}
        y={135.6}
        width={13.6}
        height={77}
        rx={8.3}
        transform="rotate(-90 147 135.6)"
        fill="#000"
      />
      <Path
        d="M98.245 207.649a7.5 7.5 0 0 1-2.745 10.245l-7.5-12.99a7.5 7.5 0 0 1 10.245 2.745ZM98.245 52.159A7.5 7.5 0 0 1 88 54.904l3.75-6.495 3.75-6.495a7.5 7.5 0 0 1 2.745 10.245Z"
        fill="#000"
      />
    </Svg>
  );
};
