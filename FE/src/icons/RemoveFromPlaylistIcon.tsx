import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const RemoveFromPlaylistIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      stroke={color}
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="-2 -3 28 28"
      strokeWidth={0.08}>
      <Path d="M11.5 0C17.847 0 23 5.153 23 11.5S17.847 23 11.5 23 0 17.847 0 11.5 5.153 0 11.5 0zm0 1C17.295 1 22 5.705 22 11.5S17.295 22 11.5 22 1 17.295 1 11.5 5.705 1 11.5 1zM5 11h13v1H5v-1z" />
    </Svg>
  );
};
