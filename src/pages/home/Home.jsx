import { Link } from "react-router";
import AvailableStudySessions from "../../components/homePage/AvailableStudySessions";
import Banner from "../../components/homePage/Banner";
import HowEduSyncWork from "../../components/homePage/HowEduSyncWork";
import SponsoredTeams from "../../components/homePage/SponsoredTeams";
import WhatOurUserSays from "../../components/homePage/WhatOurUserSays";
import WhyChooseEduSync from "../../components/homePage/WhyChooseEduSync";
import NewsLetter from "../../components/homePage/NewsLetter";

const Home = () => {

  return <>

    <Banner />
    <div className="max-w-6xl mx-auto px-4 mt-18 md:mt-26 space-y-18 md:space-y-26">
      <AvailableStudySessions />
      <SponsoredTeams />
      <HowEduSyncWork />
      <WhyChooseEduSync />
      <WhatOurUserSays />
      <NewsLetter/>
     
    </div>
  </>;
};

export default Home;
