"use client";
import { useState, useEffect } from "react";
import MenuNavBar from "../../components/Game/MainMenu/global/MenuNavBar";
import Home from "../../components/Game/MainMenu/Content/Home";
import Profile from "../../components/Game/MainMenu/Content/Profile";
import axios from "axios";
import type { HomeProps } from "../../components/Game/MainMenu/Content/Home";

export default function GameMenu() {
  const Tabs = {
    Home: 0,
    Analytics: 1,
    Profile: 2,
    Exit: 3,
  } as const;
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(Tabs.Home);
  const [isAuth, setIsAuth] = useState(false);
  const [homeProps, setHomeProps] = useState<HomeProps>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("api/me");
        console.log(res.data);

        if (res.status !== 200) {
          console.log("Backend not connected");
          return;
        }

        if (res.data.lichessUsername == null) {
          // User not connected
          window.location.href = "/api/auth/login";
        } else {
          console.log("User connected:", res.data.lichessUsername);
          setIsAuth(true);
          //Set Home props
          setHomeProps({
            username: res.data.lichessUsername.username,
            elo: res.data.lichessUsername.perfs.classical.rating,
            prog: res.data.lichessUsername.perfs.classical.prog,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        window.location.href = "/api/login";
      }
    };

    fetchUser();
  }, []);

  if (!isAuth) return null;

  return (
    <div className="flex flex-row h-screen w-screen">
      {/* Nav Bar */}
      <div className="w-[15%] fixed top-0 left-0 h-screen z-20">
        <MenuNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="w-[95%] h-full bg-gray-100 ml-[15%]">
        {activeTab === Tabs.Home && homeProps && <Home homeProps={homeProps} />}
        {activeTab === Tabs.Profile && <Profile />}
        {activeTab === Tabs.Analytics && (
          <div>
            <h1>Analytics</h1>
          </div>
        )}
        {activeTab === Tabs.Exit && (location.href = "/")}
      </div>
    </div>
  );
}
