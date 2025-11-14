import React, { useState, type ForwardRefExoticComponent, type RefAttributes } from "react";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { LockOutlined } from "@ant-design/icons";

export default function HomeButton({
  svgIcon,
  buttonTitle,
  ratioWidth,
  isLocked,
  setActive,
}: {
  svgIcon: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  buttonTitle: string;
  ratioWidth: number;
  isLocked: boolean;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = svgIcon;
  const widthPercentage = 30 * ratioWidth;

  const textColorUnhovered = "black";
  const textColorHovered = "white";

  return (
    <button
      className="relative bg-[] flex items-center flex-col justify-center gap-3 border border-gray-300 overflow-hidden transition-all duration-300"
      style={{
        width: `${widthPercentage}%`,
        height: "25vh",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!isLocked && setActive) setActive(true); }}
    >
      {/* Background Animation */}
      <div
        className="absolute bg-[#303030] transition-all duration-500 ease-in-out"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: hovered ? "100%" : "0%",
          height: hovered ? "100%" : "0%",
          borderRadius: hovered ? "0px" : "100%",
          zIndex: 0,
        }}
      />

      {/* Locked Indication */}
      {isLocked &&
        <div className="absolute w-full h-full z-10 backdrop-blur-xs flex justify-center items-center">
            <LockOutlined className="text-[40px]" />
        </div>
        }

      {/* Button title and image */}
      <div className="relative z-0 flex flex-col items-center justify-center">
        <Icon className="text-[45px] z-0 transition-colors duration-300 ease-in-out" style={{ color: hovered ? textColorHovered : textColorUnhovered }}/>
        <h1 className="text-[15px] transition-colors duration-300" style={{ color: hovered ? textColorHovered : textColorUnhovered }}>
          {buttonTitle}
        </h1>
      </div>
    </button>
  );
}
