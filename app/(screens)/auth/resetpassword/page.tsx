"use client";

import React from "react";
import ResetPasswordMobile from "./resetpassword.mobile";
import ResetPasswordWeb from "./resetpassword.web";

const ResetPasswordResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <ResetPasswordMobile />
      </div>
      <div className="hidden lg:block">
        <ResetPasswordWeb />
      </div>
    </div>
  );
};

export default ResetPasswordResponsiveness;