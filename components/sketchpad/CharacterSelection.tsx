import React, { useState, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useSketchpad } from "@/app/contexts/SketchpadContext";
import { baybayinCharacters, LABELS } from "@/constants";
import baybayify from "@/lib/baybayify";

type CharacterSelectionItemProps = {
  label: string | string[];
  character: string;
  onClick?: () => void;
  arrow?: boolean;
  bgClassName?: string;         // new: custom bg class
  hoverBgClassName?: string;    // new: custom hover bg/scale classes
} & React.HTMLAttributes<HTMLDivElement>;

type CharacterSelectionDrawerProps = {
  onSelect: (character: string) => void;
  onClose: () => void;
  characters: string[];
} & React.HTMLAttributes<HTMLDivElement>;

export const CharacterSelectionDrawer = () => {
  const sketchpadContext = useSketchpad();
  return (
    <Drawer
      open={sketchpadContext.baybayinCharacterDrawerOpen}
      onOpenChange={sketchpadContext.setBaybayinCharacterDrawerOpen}
    >
      <DrawerContent className="h-[60%] flex flex-col items-center">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">Baybayin Characters</DrawerTitle>
        </DrawerHeader>
        <div className="h-full grid grid-cols-6 gap-2 place-items-center overflow-y-auto pb-6">
          {baybayinCharacters.map((label, index) => (
            <CharacterSelectionItem
              key={index}
              label={label}
              character={baybayify(Array.isArray(label) ? label[0] : label)}
              onClick={() => {
                sketchpadContext.setSelectedCharacters([
                  ...sketchpadContext.selectedCharacters,
                  baybayify(Array.isArray(label) ? label[0] : label),
                ]);
               
              }}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const CharacterSelectionItem = (props: CharacterSelectionItemProps) => {
  const [showLatin, setShowLatin] = useState(false);
  const timer = useRef<number>(0);
  const clickTimeout = useRef<number | null>(null);

  const start = () => {
    timer.current = window.setTimeout(() => setShowLatin((v) => !v), 600);
  };
  const end = () => clearTimeout(timer.current);

  const handleClick = () => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = window.setTimeout(() => {
      props.onClick?.();
      clickTimeout.current = null;
    }, 200);
  };

  const handleDoubleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setShowLatin((v) => !v);
  };

  return (
    <div className="w-20 grid place-items-center">
      <div
        className={`w-full aspect-square font-[Baybayin_Simple_TAWBID] rounded-xl shadow-xl 
                    flex items-center justify-center cursor-pointer transition duration-300 ease-in-out 
                    ${props.bgClassName ?? 'bg-[#576eb6]'} 
                    ${props.hoverBgClassName ?? 'hover:bg-[#6e81b9] hover:scale-95'}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={start}
        onMouseUp={end}
        onTouchStart={start}
        onTouchEnd={end}
      >
        {!props.arrow && (
          <p
            className={`text-center text-[#ffd8b9] font-bold text-2xl ${
              showLatin ? "font-[Poppins]" : "font-[Baybayin_Simple_TAWBID]"
            }`}
          >
            {showLatin
              ? Array.isArray(props.label)
                ? props.label.join("/")
                : props.label
              : props.character}
          </p>
        )}
        {props.arrow && <ChevronDown size={40} className="text-[#ffd8b9]" />}
        {!props.character && !props.arrow && (
          <Plus size={40} className="text-[#ffd8b9]" />
        )}
      </div>
    </div>
  );
};
