import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const RepeatOnceIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 0 256 256"
      stroke={color}
      strokeWidth={10}
      strokeLinejoin="round"
      strokeLinecap="round">
      <Path fill="none" d="M200 88L224 64 200 40" />
      <Path d="M32 128a64.1 64.1 0 0164-64h128" fill="none" />
      <Path fill="none" d="M56 168L32 192 56 216" />
      <Path d="M224 128a64.1 64.1 0 01-64 64H32" fill="none" />
      <Path fill="none" d="M116 112L132 104 132 152" />
    </Svg>
  );
};
