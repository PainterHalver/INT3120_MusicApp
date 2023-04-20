import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

import {IconProps} from './IconProps';

export const PhoneIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="5 5 55 55" stroke={color} strokeWidth={2}>
      <Rect x={18} y={8} width={28} height={48} rx={4} fill={'#00000000'} />
      <Path d="M28 12L36 12" fill={fill} />
      <Path d="M30 52L34 52" fill={fill} />
    </Svg>
  );
};
