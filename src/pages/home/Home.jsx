import AvailableStudySessions from "../../components/homePage/AvailableStudySessions";
import Banner from "../../components/homePage/Banner";
import WhatOurUserSays from "../../components/homePage/WhatOurUserSays";

const Home = () => {

  return <>

    <Banner />
    <div className="max-w-6xl mx-auto px-4 mt-18 md:mt-26 space-y-18 md:space-y-26">
      <AvailableStudySessions />
      <WhatOurUserSays />
    </div>
  </>;
};

export default Home;
