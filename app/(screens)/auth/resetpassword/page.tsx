"use client";

import React, { Suspense } from "react";
import ResetPasswordMobile from "./resetpassword.mobile";
import ResetPasswordWeb from "./resetpassword.web";

const ResetPasswordResponsiveness = () => {
  return (
    <div>
      <Suspense>
        <div className="block lg:hidden">
          <ResetPasswordMobile />
        </div>
        <div className="hidden lg:block">
          <ResetPasswordWeb />
        </div>
      </Suspense>
    </div>
  );
};

export default ResetPasswordResponsiveness;
