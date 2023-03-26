import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const XCloseIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="0 0 1024 1024" stroke={color}>
      <G>
        <Path
          d="M176.662 817.173c-8.19 8.471-7.96 21.977.51 30.165 8.472 8.19 21.978 7.96 30.166-.51l618.667-640c8.189-8.472 7.96-21.978-.511-30.166-8.471-8.19-21.977-7.96-30.166.51l-618.666 640z"
          fill={color}
        />
        <Path
          d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166.511 8.471-8.188 8.7-21.694.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-.511-8.471 8.188-8.7 21.694-.511 30.165l618.666 640z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
