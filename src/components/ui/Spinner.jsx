import Lottie from "lottie-react";
import spinner from "../../assets/lotti/education.json";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-12 md:py-16">
      <Lottie
        animationData={spinner}
        className="w-full h-[200px] md:h-[350px]"
      ></Lottie>
    </div>
  );
};

export default Spinner;
