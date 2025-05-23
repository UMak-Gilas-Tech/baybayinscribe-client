"use client";

import React from "react";
import TermsServicesMobile from "./terms.mobile";
import TermsServicesWeb from "./terms.web";

const LoginResponsiveness = () => {
  return (
    <div>
      <div className="block lg:hidden">
        <TermsServicesMobile />
      </div>
      <div className="hidden lg:block">
        <TermsServicesWeb />
      </div>
    </div>
  );
};

export default LoginResponsiveness;