import { type FC, memo } from "react";

import type { AvatarProps } from "antd";
import { Avatar as AntdAvatar } from "antd";

type Props = AvatarProps & {
  name?: string;
};

const CustomAvatarComponent: FC<Props> = ({ name = "", style, ...rest }) => {
  return (
    <AntdAvatar
      alt={name}
      size="small"
      style={{
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style,
      }}
      {...rest}
    >
      {name[0]}
    </AntdAvatar>
  );
};

export const CustomAvatar = memo(
  CustomAvatarComponent,
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.src === nextProps.src;
  }
);
