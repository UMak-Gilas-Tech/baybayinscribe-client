"use client";

import React from "react";
import UserInfoMobile from "./userinfo.mobile";
import UserInfoWeb from "./userinfo.web";

const LoginResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <UserInfoMobile />
      </div>
      <div className="hidden lg:block">
        <UserInfoWeb />
      </div>
    </div>
  );
};

export default LoginResponsiveness;