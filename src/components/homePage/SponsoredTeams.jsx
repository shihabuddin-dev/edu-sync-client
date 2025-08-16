import React from 'react';
import Marquee from 'react-fast-marquee';
import img1 from '../../assets/sponsoredAndTeams/1.webp';
import img2 from '../../assets/sponsoredAndTeams/2.webp';
import img3 from '../../assets/sponsoredAndTeams/3.webp';
import img4 from '../../assets/sponsoredAndTeams/4.webp';
import img5 from '../../assets/sponsoredAndTeams/5.webp';
import img6 from '../../assets/sponsoredAndTeams/6.webp';
import img7 from '../../assets/sponsoredAndTeams/7.webp';
import img8 from '../../assets/sponsoredAndTeams/8.webp';
import img9 from '../../assets/sponsoredAndTeams/9.webp';
import img10 from '../../assets/sponsoredAndTeams/10.webp';
import img11 from '../../assets/sponsoredAndTeams/11.webp';
import img12 from '../../assets/sponsoredAndTeams/12.webp';
import img13 from '../../assets/sponsoredAndTeams/13.webp';
import img14 from '../../assets/sponsoredAndTeams/14.webp';

const teamImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14];
const teamImages2 = [img14, img13, img12, img11, img10, img9, img8, img7, img6, img5, img4, img3, img2, img1];

const SponsoredTeams = () => {
  return (
    <div className="overflow-y-hidden space-y-2">
      <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>Sponsored Teams</h2>
      <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Proudly showcasing our partners and teams who support and collaborate with EduSync.</p>
      <Marquee gradient={true} gradientWidth={60} speed={40} pauseOnHover={true} className="py-4 overflow-y-hidden">
        {teamImages.map((img, idx) => (
          <div key={idx} className="mx-4 flex items-center justify-center">
            <img src={img} alt={`Sponsored team ${idx + 1}`} className="h-20 w-auto object-contain rounded-md not-first:shadow-md border border-base-200 bg-white py-2 px-2" />
          </div>
        ))}
      </Marquee>
      <Marquee direction gradient={true} gradientWidth={60} speed={40} pauseOnHover={true} className="py-4 overflow-y-hidden">
        {teamImages2.map((img, idx) => (
          <div key={idx} className="mx-4 flex items-center justify-center">
            <img src={img} alt={`Sponsored team ${idx + 1}`} className="h-20 w-auto object-contain rounded-md not-first:shadow-md border border-base-200 bg-white py-2 px-2" />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default SponsoredTeams;