import React from "react";

import BaybayInscribeBackgroundImage from "@/public/images/BaybayInscribe-BackgroundImage.png"

const Background = () => {
  return (
    <img className=" -z-10 w-screen h-screen absolute object-cover " src={BaybayInscribeBackgroundImage.src} alt="" />
  );
};

export default Background;
