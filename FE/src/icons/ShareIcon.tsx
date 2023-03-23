import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from './IconProps';

export const ShareIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
  return (
    <Svg height={size} width={size} viewBox="0 0 32 32" stroke={color} strokeWidth={0.00032}>
      <Path
        d="M26 21.25a4.731 4.731 0 00-3.839 1.974l-.01.014-11.642-5.821c.152-.422.24-.909.24-1.417s-.088-.995-.249-1.447l.009.03 11.642-5.82a4.733 4.733 0 10-.902-2.78v.018V6c.007.509.095.995.25 1.449l-.01-.033-11.642 5.821a4.75 4.75 0 10-.009 5.539l.01-.014 11.642 5.821a4.562 4.562 0 00-.24 1.414V26A4.75 4.75 0 1026 21.25v0zm0-18.5A3.25 3.25 0 1122.75 6v0A3.254 3.254 0 0126 2.75h0zM6 19.25A3.25 3.25 0 119.25 16v0A3.254 3.254 0 016 19.25h0zm20 10A3.25 3.25 0 1129.25 26v0A3.252 3.252 0 0126 29.25h0z"
        fill={fill}
      />
    </Svg>
  );
};
