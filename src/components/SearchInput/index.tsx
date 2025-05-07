import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface AutoCompleteInputComponentProps {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSkipCount: React.Dispatch<React.SetStateAction<number>>;
}

export const AutoCompleteInputComponent = ({
  setSearchValue,
  setSkipCount,
}: AutoCompleteInputComponentProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchValue(inputValue);
      setSkipCount(0); // Reset pagination
    }, 300);

    return () => clearTimeout(debounce);
  }, [inputValue, setInputValue, setSearchValue, setSkipCount]);

  return (
    <div className="flex items-center justify-between w-full mb-8 gap-2">
      <Input
        type="text"
        placeholder="Search Product"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        className="w-full p-5"
      />
      {inputValue && (
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer p-5"
          onClick={() => setInputValue("")}
        >
          <CircleX />
        </Button>
      )}
    </div>
  );
};
