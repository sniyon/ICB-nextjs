import { EditFilled } from "@ant-design/icons";
import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import ProfileBackgroundImage from "../../../../assets/MainMenu/Profile/Profile_Page_bg.png";
import { motion } from "framer-motion";
import {
  act,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { CloseOutlined } from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";

type ProfileInformationProps = {
  username: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  bio: string;
  profilePictureUrl: string;
  backgroundPictureUrl: string;
};

type GamesProps = {
  history: HistoryGameCardProp[];
};

type HistoryGameCardProp = {
  isBlackWin: boolean;
  whiteName: string;
  whiteElo: number;
  blackName: string;
  blackElo: number;
  moves: number;
};

type ActivityCardProp = {
  type: string;
};

export default function Profile({
  profileProps,
}: {
  profileProps?: ProfileInformationProps;
}) {
  const [profileInformation, setProfileInformation] =
    useState<ProfileInformationProps>({
      username: "Username",
      elo: 1200,
      gamesPlayed: 4,
      wins: 3,
      losses: 1,
      bio: "This is the user bio section.",
      profilePictureUrl: "",
      backgroundPictureUrl: "",
    });
  const [previousGamesData, setPreviousGamesData] = useState<GamesProps>({
    history: [
      {
        isBlackWin: true,
        whiteName: "Opponent1",
        whiteElo: 1300,
        blackName: "Username",
        blackElo: 1200,
        moves: 10,
      },
      {
        isBlackWin: false,
        whiteName: "Username",
        whiteElo: 1200,
        blackName: "Opponent2",
        blackElo: 1250,
        moves: 15,
      },
      {
        isBlackWin: true,
        whiteName: "Opponent3",
        whiteElo: 1400,
        blackName: "Username",
        blackElo: 1200,
        moves: 20,
      },
      {
        isBlackWin: false,
        whiteName: "Username",
        whiteElo: 1200,
        blackName: "Opponent4",
        blackElo: 1350,
        moves: 25,
      },
    ],
  });
  const [numberOfGamesToShow, setNumberOfGamesToShow] = useState(1);
  const [isEditProfileMenuOpen, setIsEditProfileMenuOpen] = useState(false);
  const [activitiesData, setActivitiesData] = useState<ActivityCardProp[]>([]);
  const [isPreviousGameLoaded, setIsPreviousGameLoaded] = useState(false);
  const [isProfileInformationLoaded, setIsProfileInformationLoaded] =
    useState(false);

  useEffect(() => {
    // Fetch previous games from backend
    const fetchPreviousGames = async () => {
      try {
        const res = await fetch(`/api/getPreviousGames/${numberOfGamesToShow}`);
        const data = await res.text();
        console.log("Previous games response data:", data);
        const gamesArray = data
          .trim()
          .split("\n")
          .map((line: string) => JSON.parse(line));

        const historyData: HistoryGameCardProp[] = gamesArray.map(
          (game: any) => ({
            isBlackWin: game.winner === "black",
            whiteName: game.players.white.user
              ? game.players.white.user.name
              : "Bot",
            whiteElo: game.players.white.rating
              ? game.players.white.rating
              : game.players.white.aiLevel,
            blackName: game.players.black?.user
              ? game.players.black.user.name
              : "Bot",
            blackElo: game.players.black.rating
              ? game.players.black.rating
              : game.players.black.aiLevel,
            moves: game.moves.split(" ").length,
          })
        );
        setPreviousGamesData({ history: historyData });
      } catch (error) {
        console.error("Error fetching previous games:", error);
      }
    };
    fetchPreviousGames().then(() => setIsPreviousGameLoaded(true));
  }, [numberOfGamesToShow]);

  useEffect(() => {
    //Update Profile info from backend
    const fetchProfileInformation = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        const activitiesData = await (await fetch("/api/activities")).json();

        activitiesData.forEach((activity: any) => {
          //Check if activity has a game
          console.log("Activity data:", activity);
          if (activity.games) {
            Object.keys(activity.games).forEach((game) => {
              setActivitiesData((prevActivities) => [
                ...prevActivities,
                { type: "game" },
              ]);
            });
          } else if (activity.correspondenceEnds.correspondence.games) {
            Object.keys(
              activity.correspondenceEnds.correspondence.games
            ).forEach((game) => {
              setActivitiesData((prevActivities) => [
                ...prevActivities,
                { type: "game" },
              ]);
            });
          }
        });

        const bioText =
          data.lichessUsername.profile?.bio || "This is the user bio section.";
        const avatarMatch = bioText.match(/\[avatar\](.*?)\[\/avatar\]/);
        const backgroundMatch = bioText.match(
          /\[background\](.*?)\[\/background\]/
        );
        const cleanBio = bioText
          .replace(/\[avatar\](.*?)\[\/avatar\]/g, "")
          .replace(/\[background\](.*?)\[\/background\]/g, "")
          .trim();

        if (data.lichessUsername) {
          setProfileInformation({
            username: data.lichessUsername.username,
            elo: data.lichessUsername.perfs.classical.rating,
            gamesPlayed: data.lichessUsername.perfs.classical.games,
            wins: data.lichessUsername.perfs.classical.wins,
            losses: data.lichessUsername.perfs.classical.losses,
            bio: cleanBio || "no bio set",
            profilePictureUrl: avatarMatch
              ? avatarMatch[1]
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lichess_Logo_2019.svg/240px-Lichess_Logo_2019.svg.png",
            backgroundPictureUrl: backgroundMatch
              ? backgroundMatch[1]
              : ProfileBackgroundImage,
          });
        }
      } catch (error) {
        console.error("Error fetching profile information:", error);
      }
    };
    fetchProfileInformation().then(() => setIsProfileInformationLoaded(true));
  }, []);

  if (!isPreviousGameLoaded || !isProfileInformationLoaded) {
    return <div className=""></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, top: 20 }}
      animate={{ opacity: 1, top: 0 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full flex flex-col items-center"
    >
      {/* Edit Profile Menu */}
      {isEditProfileMenuOpen && (
        <EditProfileMenu setIsEditProfileMenuOpen={setIsEditProfileMenuOpen} />
      )}

      {/* Background Header */}
      <motion.div className="absolute w-full h-[25vh] shadow-sm flex justify-center">
        <img
          src={
            profileInformation.backgroundPictureUrl || ProfileBackgroundImage
          }
          className="absolute h-full w-full object-cover  shadow-xs"
        />
      </motion.div>

      {/* top gap */}
      <div className="h-[20vh] w-full" />

      {/* Profile stats card floating below the header */}
      <div className="w-[80%] rounded-xl flex items-center gap-10 justify-between z-10 ">
        <div className="flex self-start">
          <div className="flex flex-col items-center">
            <img
              className="w-[90px] h-[90px] rounded-full border-2 border-white"
              src={
                profileInformation.profilePictureUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lichess_Logo_2019.svg/240px-Lichess_Logo_2019.svg.png"
              }
              alt="Profile"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setIsEditProfileMenuOpen(true);
          }}
          className="flex flex-row bg-[#292929] gap-3 w-[130px] h-[35px] justify-center items-center rounded-md"
        >
          <EditFilled style={{ color: "white" }} className="text-[12px]" />
          <h1 className="text-white text-[12px]">Edit</h1>
        </button>
      </div>

      {/* Username and Bio */}
      <div className="w-[80%] ml-[15px]">
        <h1 className="text-lg self-start font-semibold">
          {profileInformation.username}
        </h1>
        <p className="text-[8px] italic text-gray-500">
          {profileInformation.bio}
        </p>
      </div>

      {/* Activity Feed */}
      <div className="w-[80%] mt-10">
        <div>
          <h1 className="font-bold text-lg text-gray-700">Recent Activity</h1>
          <div className="w-full h-[1px] bg-gray-300" />
        </div>

        {/* Content */}
        <div className="flex flex-row justify-around gap-2 mt-2">
          {activitiesData.length === 0 ? (
            <p className="text-[10px] italic text-gray-500">
              No recent activity
            </p>
          ) : (
            activitiesData
              .slice(activitiesData.length - 3, activitiesData.length)
              .map((activity, index) => (
                <ActivityCard key={index} activityProps={activity} />
              ))
          )}
        </div>
      </div>

      {/* Games Stats and  Friends list*/}
      <div className="w-[80%] mt-10 flex flex-row gap-[10%]">
        {/* Game Stats */}
        <div className="w-[40%]">
          <div>
            <h1 className="font-bold text-lg text-gray-700">Statistics</h1>
            <div className="w-full h-[1px] bg-gray-300" />
          </div>

          <div className="flex flex-row mt-5 gap-5">
            {/* Wins */}
            <div className="w-[50%] flex flex-col rounded-md p-2 shadow-md ">
              <span className="text-xs text-gray-600">Wins:</span>
              <h1 className="text-black ml-2 font-bold">
                {profileInformation.wins
                  ? (
                      (profileInformation.wins /
                        profileInformation.gamesPlayed) *
                      100
                    ).toFixed(0) + "%"
                  : "-"}
              </h1>
            </div>

            {/* Losses */}
            <div className="w-[50%] flex flex-col rounded-md p-2 shadow-lg bg-[#303030]">
              <span className="text-xs text-white">Losses:</span>
              <h1 className="text-black ml-2 text-white font-bold">
                {profileInformation.losses
                  ? (
                      (profileInformation.losses /
                        profileInformation.gamesPlayed) *
                      100
                    ).toFixed(0) + "%"
                  : "-"}
              </h1>
            </div>
          </div>
        </div>

        {/*Friends*/}
        <div className="w-[60%]">
          <div>
            <h1 className="font-bold text-lg text-gray-700">Following</h1>
            <div className="w-full h-[1px] bg-gray-300" />
          </div>

          {/* Under Construction */}
          <div className="h-[120px] mt-5 rounded-md shadow-md p-3 flex flex-col gap-2 justify-center items-center bg-white/2 border-dashed border-2 border-gray-300">
            <p className="text-[10px]">No Followers</p>
          </div>
        </div>
      </div>

      {/* Previous games */}
      <div className="w-[80%] h-[10px] mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-bold text-lg text-gray-700">Previous Games</h1>
          <div className="w-full h-[1px] bg-gray-300" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-3 mt-3"
        >
          {previousGamesData.history
            .slice(0, numberOfGamesToShow)
            .map((game, index) => (
              <HistoryCard key={index} HistoryGameCardProp={game} />
            ))}

          <button
            onClick={() => {
              setNumberOfGamesToShow(numberOfGamesToShow + 3);
            }}
            className="w-full mt-5 h-[40px] shadow-md border-gray-300 border-[0.5px] rounded-md hover:bg-gray-300 duration-300"
          >
            <h1 className="text-black text-[12px]">Show More</h1>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function HistoryCard({
  HistoryGameCardProp,
}: {
  HistoryGameCardProp: HistoryGameCardProp;
}) {
  const textColor = HistoryGameCardProp.isBlackWin ? "white" : "black";
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-[8vh] flex justify-between pl-5 pr-5 items-center gap-1 shadow-xl rounded-md
          ${
            HistoryGameCardProp.isBlackWin
              ? "bg-[#303030] text-white hover:bg-[#1D1D1D]"
              : "bg-white text-black hover:bg-[#F5F5F5]"
          }`}
    >
      <div
        className="flex items-center gap-1 w-[30%] min-w-[150px]"
        style={{ color: textColor }}
      >
        <h1 className="font-bold">{HistoryGameCardProp.whiteName}</h1>
        <span className="text-[8px] text-gray-500 italic">
          ({HistoryGameCardProp.whiteElo})
        </span>
        <CheckSquareFilled className="text-[20px]" />
      </div>

      {/* Stats Section */}
      <div
        className={`flex gap-2 items-center h-full shadow-md pl-10 pr-10 ${
          HistoryGameCardProp.isBlackWin
            ? "text-black bg-white"
            : "text-white bg-[#292929]"
        } rounded-md`}
      >
        {/*Moves */}
        <div className="flex flex-col items-center">
          <span className="text-xs">Moves:</span>
          <span className="text-lg font-bold">{HistoryGameCardProp.moves}</span>
        </div>
        <div
          className={`w-[1px] h-[30px] ${
            HistoryGameCardProp.isBlackWin ? "bg-gray-300" : "bg-white/20"
          }`}
        />

        {/* Member Since */}
        <div className="flex flex-col items-center">
          <span className="text-xs">Black ELO:</span>
          <span className="text-lg font-bold">
            {HistoryGameCardProp.blackElo}
          </span>
        </div>
        <div
          className={`w-[1px] h-[30px] ${
            HistoryGameCardProp.isBlackWin ? "bg-gray-300" : "bg-white/20"
          }`}
        />

        {/* Games Played */}
        <div className="flex flex-col items-center">
          <span className="text-xs">White ELO:</span>
          <span className="text-lg font-bold">
            {HistoryGameCardProp.whiteElo}
          </span>
        </div>
      </div>

      {/* Opponent */}
      <div className="flex items-center gap-1 w-[30%] min-w-[150px] justify-end">
        <h1 className="font-bold">{HistoryGameCardProp.blackName}</h1>
        <span className="text-[8px] text-gray-500 italic">
          ({HistoryGameCardProp.blackElo})
        </span>
        <CloseSquareFilled className="text-[20px]" />
      </div>
    </motion.div>
  );
}

function FollowingCard({
  name = "name",
  isOnline = true,
}: {
  name: string;
  isOnline: boolean;
}) {
  return (
    <div className="w-full h-[40px] flex gap-4 items-center justify-start bg-white rounded-sm p-3">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: isOnline ? "#6aff59" : "#303030" }}
      />
      <h1 className="font-semibold text-xs">{name}</h1>
    </div>
  );
}

function ActivityCard({ activityProps }: { activityProps: ActivityCardProp }) {
  return (
    <>
      {activityProps.type === "game" && (
        <div className="w-full flex flex-col justify-center items-center gap-1 bg-transparent opacity-90 text-gray-500 rounded-md p-2 shadow-sm">
          {/* Image */}
          <i className="bi bi-controller text-[40px]"></i>
          <span className="text-[10px]">Started a game</span>
        </div>
      )}
    </>
  );
}

function EditProfileMenu({
  setIsEditProfileMenuOpen,
}: {
  setIsEditProfileMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute fixed w-screen h-screen top-0 left-0 flex flex-col items-center justify-center backdrop-blur-xs bg-white/5 z-50"
    >
      <div className="relative w-[400px] h-[400px] bg-white opacity-90 rounded-md shadow-lg flex flex-col items-center justify-between pt-0 pb-5">
        {/* X Button */}
        <div className="absolute top-3 right-3 z-60">
          <button
            onClick={() => {
              setIsEditProfileMenuOpen(false);
            }}
            className="flex justify-center items-center p-1 rounded-md bg-white hover:bg-gray-200 duration-300"
          >
            <CloseOutlined style={{ fontSize: "10px", color: "black" }} />
          </button>
        </div>

        {/* Title Section */}
        <div className="w-full h-[40px] flex items-center justify-center bg-[#303030] mb-5 p-6">
          <h1 className="text-white font-bold">Edit Profile</h1>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-[90%]">
            <p className="text-xs text-black font-bold">Username:</p>
            <input
              className="w-full border-gray-300 border-[1px] rounded-md p-1 text-xs"
              placeholder="ICB-bot"
            />
          </div>

          <div className="w-[90%]">
            <p className="text-xs text-black font-bold">Bio:</p>
            <input
              className="w-full border-gray-300 border-[1px] rounded-md p-1 text-xs"
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="w-[90%]">
            <p className="text-xs text-black font-bold">Profile Picture URL:</p>
            <input
              className="w-full border-gray-300 border-[1px] rounded-md p-1 text-xs"
              placeholder="Profile Picture URL"
            />
          </div>
          <div className="w-[90%]">
            <p className="text-xs text-black font-bold">
              Background Picture URL:
            </p>
            <input
              className="w-full border-gray-300 border-[1px] rounded-md p-1 text-xs"
              placeholder="Background Picture URL"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-[90%] flex items-center justify-center mt-5">
          <button className="w-full bg-white text-black border-[0.5px] border-gray-300 italic shadow-md py-2 px-4 text-xs rounded-md hover:bg-[#303030] hover:text-white duration-400">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
