"use client";

import React from "react";
import RegisterMobile from "./register.mobile";
import RegisterWeb from "./register.web";

const LoginResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <RegisterMobile />
      </div>
      <div className="hidden lg:block">
        <RegisterWeb />
      </div>
    </div>
  );
};

export default LoginResponsiveness;