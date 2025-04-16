"use client";

import React from "react";
import ProfPicMobile from "./profpic.mobile";
import ProfPicWeb from "./profpic.web";

const LoginResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <ProfPicMobile />
      </div>
      <div className="hidden lg:block">
        <ProfPicWeb />
      </div>
    </div>
  );
};

export default LoginResponsiveness;