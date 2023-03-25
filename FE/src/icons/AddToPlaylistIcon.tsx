import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

import {IconProps} from './IconProps';

export const AddToPlaylistIcon: React.FC<IconProps> = ({
  size = 30,
  color = '#000',
  fill = color,
}: IconProps) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="-35 -30 265 265"
      stroke={color}
      strokeWidth={0.49700000000000005}>
      <Path
        d="M136.906 179.109c0 22.987-18.635 41.622-41.622 41.622s-41.622-18.635-41.622-41.622c0-22.988 18.635-41.622 41.622-41.622s41.622 18.634 41.622 41.622z"
        stroke="#000"
        strokeWidth={10}
        fill="transparent"
      />
      <Path
        d="M130.96 30.458a5.946 5.946 0 1111.892 0V179.11H130.96V30.459z"
        fill="#000"
        strokeWidth={0.000005}
      />
      <Path
        d="M137.075 26.334a2.379 2.379 0 013.351-.293l43.727 36.692a5.946 5.946 0 11-7.644 9.11l-38.261-32.106a9.514 9.514 0 01-1.173-13.403z"
        fill="#000"
        strokeWidth={0.04}
      />
      <Rect x={35.8239} y={0.728333} width={10} height={83.2442} rx={5.94601} fill="#000" />
      <Rect x={0.147858} y={36.4044} width={83.2442} height={10} rx={5.94601} fill="#000" />
    </Svg>
  );
};
