import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const HeartIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = 'none',
  strokeWidth = 1.0,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path
        d="M12 20s9-4 9-10.286C21 6 18.965 4 16.454 4a4.465 4.465 0 00-3.214 1.38l-.52.54a1 1 0 01-1.44 0l-.52-.54A4.465 4.465 0 007.546 4C5 4 3 6 3 9.714 3 16 12 20 12 20z"
        fillRule="evenodd"
        fill={fill === color ? fill : 'none'}
      />
    </Svg>
  );
};
