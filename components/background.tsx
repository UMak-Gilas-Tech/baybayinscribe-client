import React from "react";
import Image from "next/image";
import BaybayInscribeBackgroundImage from "@/public/images/BaybayInscribe-BackgroundImage.webp";

const Background = () => {
  return (
    <Image
      src={BaybayInscribeBackgroundImage}
      alt="Background"
      fill
      priority
      className="-z-10 w-screen h-screen absolute object-cover inset-0"
      quality={80}
      sizes="100vw"
    />
  );
};

export default Background;
