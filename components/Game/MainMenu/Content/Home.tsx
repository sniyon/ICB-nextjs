import { useState } from "react";
import HomeButton from "../Home/HomeButton";
import {
  RobotOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  DoubleRightOutlined,
  HourglassOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";

export type HomeProps = {
  username: string;
  elo: string;
  prog: string;
};

export default function Home({ homeProps }: { homeProps: HomeProps }) {
  const [isVsBotSubMenuOpen, setIsVsBotSubMenuOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      {/* Sub Menues */}
      {isVsBotSubMenuOpen && (
        <VsBotSubMenu setIsVsBotSubMenuOpen={setIsVsBotSubMenuOpen} />
      )}

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-[8vh] flex justify-end p-[10px]"
      >
        {/* Profile iInformation */}
        <div className="w-fit justify-end hover:shadow-md hover:bg-[#303030] hover:text-white duration-300 ease-in-out rounded-full flex items-center gap-2 p-[5px]">
          <h1 className="text-[10px] ml-[10px]">{homeProps.username}</h1>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lichess_Logo_2019.svg/240px-Lichess_Logo_2019.svg.png"
            className="rounded-full w-[2.5rem] h-[2.5rem] bg-black"
          />
        </div>
      </motion.div>

      {/* Play Mod Selection */}
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        {/* ELO informations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-center text-[10px] mb-0 mt-0 leading-none">
            Your Elo:
          </h1>

          <div className="flex justify-center items-center mt-0 mb-0 leading-none">
            <span className="text-[35px] mt-0 font-semibold">
              {homeProps.elo}
            </span>
            <ArrowUpOutlined
              className="text-[15px] text-[#0CFF75] ml-1 mt-0"
              style={{ color: "#0CFF75" }}
            />
            <span className="text-[15px] text-[#0CFF75] mt-0">
              {homeProps.prog}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-[80%] flex flex-col"
        >
          {/* Quick Play text */}
          <div className="mb-[10px]">
            <h1>Quick Play</h1>
            <div className="h-[1px] w-full bg-gray-300" />
          </div>
          {/* First Row */}
          <div className="w-full flex">
            <HomeButton
              setActive={setIsVsBotSubMenuOpen}
              isLocked={false}
              ratioWidth={1.5}
              svgIcon={RobotOutlined}
              buttonTitle="Vs. Bot"
            />
            <HomeButton
              isLocked={true}
              ratioWidth={1}
              svgIcon={ThunderboltOutlined}
              buttonTitle="Rapid Online"
            />
            <HomeButton
              isLocked={true}
              ratioWidth={1}
              svgIcon={TeamOutlined}
              buttonTitle="Vs. Friend"
            />
          </div>

          {/* Second Row */}
          <div className="w-full flex">
            <div className="w-[45%]" />
            <HomeButton
              isLocked={true}
              ratioWidth={1}
              svgIcon={DoubleRightOutlined}
              buttonTitle="Bullet Online"
            />
            <HomeButton
              isLocked={true}
              ratioWidth={1}
              svgIcon={HourglassOutlined}
              buttonTitle="Blitz Online"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function VsBotSubMenu({
  setIsVsBotSubMenuOpen,
}: {
  setIsVsBotSubMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isCrossButtonHovered, setIsCrossButtonHovered] = useState(false);
  const [colorChoice, setColorChoice] = useState<"white" | "black" | "random">(
    "white"
  );
  const [difficulty, setDifficulty] = useState(1);

  const handleStartButtonClick = async () => {
    try {
      const newGameResponse = await axios.get(
        "/api/createGame/" + colorChoice + "/" + difficulty
      );
      const userResponse = await axios.get("/api/me");

      // Safely extract IDs
      const gameId = newGameResponse.data?.id;
      const userId = userResponse.data?.lichessUsername?.id;

      if (!gameId || !userId) {
        console.error("Game ID or User ID is missing", {
          newGameResponse,
          userResponse,
        });
        return;
      }

      window.location.href = `/game/${userId}/${gameId}`;
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <motion.div
      initial={{ backdropFilter: "blur(0px)" }}
      animate={{ backdropFilter: "blur(2px)" }}
      exit={{ backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
      className="absolute w-full h-full bg-white/4 backdrop-blur-sm z-20 top-0 left-0 flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className="w-100 h-100 bg-white opacity-80 backdrop-blur-md shadow-lg rounded-md p-5 flex flex-col gap-5"
      >
        {/* X Button */}
        <button
          className="absolute top-2 right-2 w-8 h-8 flex justify-center items-center rounded-md bg-white hover:bg-black duration-300"
          onMouseEnter={() => setIsCrossButtonHovered(true)}
          onMouseLeave={() => setIsCrossButtonHovered(false)}
          onClick={() => setIsVsBotSubMenuOpen?.(false)}
        >
          <CloseOutlined
            style={{ color: isCrossButtonHovered ? "#FFFFFF" : "#000000" }}
          />
        </button>

        {/* Title */}
        <motion.div
          transition={{ duration: 0.3 }}
          className="flex w-full border-[0.2px] border-[#f2f2f2] items-center justify-center bg-white p-2 rounded-md shadow-md"
        >
          <h1 className="text-center text-black font-semibold text-lg">
            Vs. Bot
          </h1>
        </motion.div>

        {/* Color Choice */}
        <div>
          <h1 className="italic text-xs w-[80%] justify-self-center self-center">
            Color:
          </h1>
          <div className="w-[80%] h-[1px] bg-black mb-2 justify-self-center self-center" />
          <div className="relative flex flex-row w-[80%] justify-self-center self-center items-center border-[0.5px] border-black rounded-md">
            {/* White */}
            <button
              className={`w-[50%] h-full border-r-[0.5px] border-black flex justify-center items-center duration-300 p-2 ${
                colorChoice === "white" ? "bg-black" : " hover:bg-gray-200"
              }`}
              onClick={() => setColorChoice("white")}
            >
              <img src="/assets/pieces_icons/k.png" className="w-8 h-8" />
            </button>

            {/* Black */}
            <button
              className={`w-[50%] h-full border-r-[0.5px] border-black flex justify-center items-center duration-300 p-2 ${
                colorChoice === "black" ? "bg-black" : " hover:bg-gray-200"
              }`}
              onClick={() => setColorChoice("black")}
            >
              <img src="/assets/pieces_icons/k_b.png" className="w-8 h-8" />
            </button>

            {/* Random */}
            <button
              className={`rounded-full shadow-lg absolute w-5 h-5 top-[50%] left-[50%] flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2 duration-300 ${
                colorChoice === "random"
                  ? "bg-black"
                  : " bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setColorChoice("random")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill={colorChoice === "random" ? "white" : "currentColor"}
                className="bi bi-dice-5"
                viewBox="0 0 16 16"
              >
                <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z" />
                <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h1 className="italic text-xs w-[80%] justify-self-center self-center">
            Difficulty:
          </h1>
          <div className="w-[80%] h-[1px] bg-black mb-2 justify-self-center self-center" />
          <div className="w-[80%] justify-self-center self-center">
            <input
              type="range"
              min={1}
              max={5}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full text-black accent-black text-white"
            />
            <h1 className="text-xs text-right italic">Elo: {difficulty}</h1>
          </div>
        </div>

        {/* Start Button */}
        <div className="absolute w-[80%] bottom-10 justify-self-center self-center">
          <button
            className=" w-full h-10 bg-black text-white rounded-md "
            onClick={handleStartButtonClick}
          >
            Start
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
