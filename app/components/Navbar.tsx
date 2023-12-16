import { Inter } from "next/font/google";
const inter = Inter({ weight: ["600", "400", "900"], subsets: ["latin"] });
export const Navbar = () => {
  return (
    <div className="py-4 px-9 fixed z-10 w-screen h-20 flex flex-row items-center justify-between bg-gradient-to-b from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.5)]   to-[rgba(0,0,0,0.0)]">
      <h3
        className={`text-white font-black text-[32px] tracking-widest${inter.className}`}
      >
        LOOK
      </h3>

      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-8 h-8 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg> */}
    </div>
  );
};
