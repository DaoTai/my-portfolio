import { SunIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

const ToggleMode = () => {
  return (
    <Button size={"icon"} className="rounded-full">
      <SunIcon className="text-yellow-500" />
    </Button>
  );
};

export default ToggleMode;
