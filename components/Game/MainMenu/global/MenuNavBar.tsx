import MainLogoDark from "@/public/assets/global/icon_dark.svg";
import {
  useState,
  type Dispatch,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type SetStateAction,
} from "react";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { HomeFilled } from "@ant-design/icons";
import { DotChartOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";

export default function MenuNavBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<0 | 1 | 2 | 3>>;
}) {
  const Tabs = {
    Home: 0,
    Analytics: 1,
    Profile: 2,
    Exit: 3,
  } as const;
  return (
    <div className="h-screen w-[100%] shadow-md">
      {/* top */}
      <div className=" relative flex items-center justify-center w-full h-[10%]">
        <img src={MainLogoDark} alt="Main Logo" className="h-8  w-auto " />
      </div>

      {/* middle */}
      <div className="relative flex items-center h-[70%]">
        <div className="w-full">
          <MenuNavBarItem
            svgIcon={HomeFilled}
            title="Home"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            thisTab={Tabs.Home}
            textColor="black"
          />
          <MenuNavBarItem
            svgIcon={UserOutlined}
            title="Profile"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            thisTab={Tabs.Profile}
            textColor="black"
          />
        </div>
      </div>

      {/* bottom items */}
      <div className=" relative flex items-end justify-center w-full h-[20%] pb-2">
        <div className=" w-full">
          <MenuNavBarItem
            svgIcon={DotChartOutlined}
            title="Exit"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            thisTab={Tabs.Exit}
            textColor="red"
          />
        </div>
      </div>
    </div>
  );
}

function MenuNavBarItem({
  svgIcon,
  title,
  activeTab,
  setActiveTab,
  thisTab,
  textColor,
}: {
  svgIcon: ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>
  >;
  title: string;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<0 | 1 | 2 | 3>>;
  thisTab: 0 | 1 | 2 | 3;
  textColor: string;
}) {
  const Icon = svgIcon;
  const [hovered, setHovered] = useState(false);
  const selected = activeTab === thisTab;
  return (
    <button
      className=" relative w-full h-15 flex items-center text-center bg-blue-200 gap-4 duration-300 ease-in-out"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setActiveTab(thisTab)}
      style={{
        backgroundColor: hovered && !selected ? "#f3f3f3ff" : "transparent",
        boxShadow:
          selected || hovered ? "1px 0px 5px 0px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <div
        className="z-0 background-select absolute h-full w-2 left-0 duration-300 ease-in-out"
        style={{
          backgroundColor: hovered || selected ? "#303030" : "transparent",
          width: selected ? "100%" : "2%",
          borderRadius: selected ? "0" : "10px",
        }}
      />

      <Icon
        className="z-10 ml-10"
        style={{ color: selected ? "white" : textColor }}
      />
      <h1
        className="z-10 flex justify-self-center duration-300 ease-in-out font-semibold"
        style={{ color: selected ? "white" : textColor }}
      >
        {title}
      </h1>
    </button>
  );
}
