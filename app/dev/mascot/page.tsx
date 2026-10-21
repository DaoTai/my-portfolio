import { notFound } from "next/navigation";
import { MascotLab } from "./MascotLab";

export const metadata = { robots: { index: false } };

/** Dev-only bench for tuning the mascot rig; production builds answer 404. */
const MascotLabPage = () => {
  if (process.env.NODE_ENV === "production") notFound();
  return <MascotLab />;
};

export default MascotLabPage;
