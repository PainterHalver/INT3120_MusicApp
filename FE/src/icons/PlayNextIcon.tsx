import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const PlayNextIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="-10 -5 79 79" stroke={color}>
      <Path
        d="M10.375 13.834l31.5 18.186c3.833 2.213 3.833 7.746 0 9.96l-31.5 18.186c-3.833 2.213-8.625-.553-8.625-4.98V18.814c0-4.426 4.792-7.192 8.625-4.98z"
        stroke="#000"
        strokeWidth={3.2}
        fill="transparent"
      />
      <Path
        d="M35.116 9.116a1.25 1.25 0 000 1.768l7.955 7.955a1.25 1.25 0 101.768-1.768L37.768 10l7.07-7.071a1.25 1.25 0 10-1.767-1.768l-7.955 7.955zM36 11.25h26v-2.5H36v2.5zM65.75 15v10.5h2.5V15h-2.5zm0 10.5V41h2.5V25.5h-2.5zM62 11.25A3.75 3.75 0 0165.75 15h2.5A6.25 6.25 0 0062 8.75v2.5z"
        fill="#000"
        strokeWidth={0.5}
      />
    </Svg>
  );
};
