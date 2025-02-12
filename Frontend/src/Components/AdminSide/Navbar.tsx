
import Lottie from "lottie-react";
import logoWeb from "../Animations/Animation - 1724244656671.json";
const Navbar = () => {
  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lottie animationData={logoWeb} style={{ width: "9%" }} />
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "Viaoda Libre" }}
          >
            Clear View
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
