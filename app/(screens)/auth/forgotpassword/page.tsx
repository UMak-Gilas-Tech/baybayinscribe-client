"use client";

import React from "react";
import ForgotPasswordMobile from "./forgotpassword.mobille";
import ForgotPasswordWeb from "./forgotpassword.web";

const ForgotPasswordResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <ForgotPasswordMobile />
      </div>
      <div className="hidden lg:block">
        <ForgotPasswordWeb />
      </div>
    </div>
  );
};

export default ForgotPasswordResponsiveness;