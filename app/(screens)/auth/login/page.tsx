"use client";

import React from "react";
import LoginMobile from "./login.mobile";
import LoginWeb from "./login.web";

const LoginResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <LoginMobile />
      </div>
      <div className="hidden lg:block">
        <LoginWeb />
      </div>
    </div>
  );
};

export default LoginResponsiveness;