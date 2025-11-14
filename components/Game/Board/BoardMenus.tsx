import { useEffect, useRef, useState} from "react";
import { gsap } from "gsap";
import { Pi } from "lucide-react";

export default function BoardMenus({ active, setActive, setSelectedPromotion, menuType, result }: { active: boolean, setActive: React.Dispatch<React.SetStateAction<boolean>>, setSelectedPromotion: React.Dispatch<React.SetStateAction<string | null>>, menuType: string, result: string }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() =>{
    gsap.to(".menu", { y: active ? 0 : 100, opacity: active ? 0.94 : 0, zIndex: active ? 10: -10, duration: 0.5 });
    gsap.to(".overlay", {  opacity: active ? 0.2 : 0, zIndex: active ?  9: -10, duration: 0.5 });
  }, [active])

  return (
    <div>
      {menuType === "promotePawn" && (
        <PromotePawnMenu
          setActive={setActive}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}
      {menuType === "result" && <ResultMenu result={result}/>}
    </div>
  );
}

function PromotePawnMenu({
  setActive,
  setSelectedPromotion
}: {
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPromotion: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [dicedHovered, setDicedHovered] = useState(false);
  return(
    <>
    {/* OverLay */}

      {/* Promotion Menu */}
      <div className="menu absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[380px] gap-10 bg-white shadow-xl flex flex-col items-center">
        <h1 className="font-[poppins] w-full mt-4 text-black text-center font-bold text-[24px] flex items-center justify-center">
          PROMOTE PAWN
        </h1>
        <div className="w-[95%] h-[60%] flex flex-row">
          <div className="flex flex-row justify-around w-[100%]">
            <PieceButton setSelectedPromotion={setSelectedPromotion} setActive={setActive} label="Knight" type="n"/>
            <PieceButton setSelectedPromotion={setSelectedPromotion} setActive={setActive} label="Bishop" type="b"/>
            <PieceButton setSelectedPromotion={setSelectedPromotion} setActive={setActive} label="Rook" type="r"/>
            <PieceButton setSelectedPromotion={setSelectedPromotion} setActive={setActive} label="Queen" type="q"/>
          </div>
        </div>

        {/* Dice button */}
        <div onClick={() => OnDiceButtonClick(setSelectedPromotion, setActive)} onMouseOver={() =>{setDicedHovered(true)}} onMouseOut={() => {setDicedHovered(false)}} className="absolute top-4 right-4">
          <button className="bg-white p-2 rounded-md shadow-md hover:bg-gray-900 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={dicedHovered?"white": "currentColor"} className="bi bi-dice-5" viewBox="0 0 16 16">
              <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z"/>
              <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
          </button>
        </div>

      </div>
    </>
  );
}


function PieceButton({
  setSelectedPromotion,
  setActive,
  label,
  type
}: {
  setSelectedPromotion: React.Dispatch<React.SetStateAction<string | null>>,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  label: string,
  type: string
}) {
  const [hovered, setHovered] = useState(false);
  const pieceImageSrc = `/assets/pieces_icons/${hovered ? type : type + `_b`}.png`;

  return (
    <button
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={() => OnPromotionCardClick(setSelectedPromotion, setActive, type)}
      className="w-[22%] bg-white duration-500 hover:bg-gray-900 flex items-center justify-center flex-col border border-gray-300"
    >
      <img src={pieceImageSrc} />
      <div className="w-[60px] h-[1px] bg-gray-300" />
      <h1
        className="text-black text-center font-[Poppins] mt-2 text-[20px]"
        style={{ color: hovered ? "white" : "black" }}
      >
        {label}
      </h1>
    </button>
  );
}

function OnDiceButtonClick(setSelectedPromotion: React.Dispatch<React.SetStateAction<string | null>>, setActive: React.Dispatch<React.SetStateAction<boolean>>) {
  const randomNumber = Math.random();
  const type = randomNumber < 0.25 ? "n" : randomNumber < 0.5 ? "b" : randomNumber < 0.75 ? "r" : "q";
  OnPromotionCardClick(setSelectedPromotion, setActive, type);
}

function OnPromotionCardClick(setSelectedPromotion: React.Dispatch<React.SetStateAction<string | null>>, setActive: React.Dispatch<React.SetStateAction<boolean>>, type:string) {
  setSelectedPromotion(type);
  setActive(false);
}


function ResultMenu({result}:{result: string}) {
  const winColor = "#09de29";
  return (
    <>
    {/* OverLay */}
    <div className="overlay absolute w-[100vw] h-[100vh] bg-black top-0 left-0 opacity-20" />

    <div className="menu absolute top-0 left-0 w-full h-full result-menu">

      {/* Result Menu */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35%] h-[300px] bg-white shadow-lg flex flex-col rounded-md">

      {/* Result Header */}
        <div className="absolute w-full leading-none text-center text-white h-[25%] shadow-md justify-center flex flex-col items-center bg-black">
          <h1 className="text-[10px]">RESULT:</h1>
          <h1 className="text-[180%] font-bold">{result}</h1>
        </div>

        {/* Elo Section */}
        <div className="h-[100%] justify-center flex flex-col items-center">

          <h1 className="text-center">Elo:</h1>

          <div className="flex flex-row items-center gap-1 leading-none text-center justify-center">
            <h2 className="text-[300%] text-gray-500 font-light"> 1500</h2>
            <h1 className="text-[80%]" style={{color: winColor}}>+10</h1>
          </div>
        </div>

        {/* Exit Button */}
        <div className=" absolute bottom-[30px] w-full flex justify-center items-center">
            <button onClick={() => {window.location.href = '/menu'}} className=" w-[80%] h-[40px] flex justify-center items-center justify-self-center align-self-center border-black border-[1px] rounded-md  hover:bg-black hover:text-white duration-200">
                <span  className="text-center">Exit</span>
            </button>
        </div>

      </div>
    </div>
    </>
  );
}
