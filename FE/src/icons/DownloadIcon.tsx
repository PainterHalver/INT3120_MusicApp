import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const DownloadIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="-51.2 -51.2 614.40 614.40"
      stroke={color}
      strokeWidth={5.12}>
      <Path d="M256 0C114.608 0 0 114.608 0 256s114.608 256 256 256 256-114.608 256-256S397.392 0 256 0zm0 496C123.664 496 16 388.336 16 256S123.664 16 256 16s240 107.664 240 240-107.664 240-240 240z" />
      <Path d="M350.544 259.968l-86.192 86.192V121.504h-16V347.92l-87.968-87.968-11.312 11.312L249.808 372a7.968 7.968 0 005.664 2.336 8.035 8.035 0 005.664-2.336l3.024-3.024h.208v-.208l97.504-97.504-11.328-11.296z" />
    </Svg>
  );
};
