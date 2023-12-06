import { DM_Sans } from "next/font/google";
const dm_sans = DM_Sans({ weight: ["600", "400"], subsets: ["latin"] });
export const Navbar = () => {
  return (
    <div className="p-4 backdrop-blur-lg bg-black/30 fixed z-10 w-screen font-semibold border-b-2 stroke-white">
      <h3
        className={`text-white font-extrabold text-xl tracking-widest${dm_sans.className}`}
      >
        Look
      </h3>
    </div>
  );
};
