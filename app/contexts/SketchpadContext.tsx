import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface SketchpadContextType {
  selectedCharacters: string[];

  baybayinCharacterDrawerOpen: boolean;
  setBaybayinCharacterDrawerOpen: (open: boolean) => void;
  setSelectedCharacters: (characters: string[]) => void;
}

const SketchpadContext = createContext<SketchpadContextType | undefined>(
  undefined
);

export const SketchpadProvider = ({ children }: { children: ReactNode }) => {
  const [baybayinCharacterDrawerOpen, setBaybayinCharacterDrawerOpen] =
    useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  return (
    <SketchpadContext.Provider
      value={{
        selectedCharacters,
        baybayinCharacterDrawerOpen,
        setBaybayinCharacterDrawerOpen,
        setSelectedCharacters,
      }}
    >
      {children}
    </SketchpadContext.Provider>
  );
};

export const useSketchpad = () => {
  const ctx = useContext(SketchpadContext);
  if (!ctx)
    throw new Error("useSketchpad must be used inside SketchpadProvider");
  return ctx;
};
