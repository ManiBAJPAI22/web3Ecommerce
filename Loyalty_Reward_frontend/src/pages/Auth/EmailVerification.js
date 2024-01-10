import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

const EmailVerification = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("oobCode:", oobCode);

        if (oobCode) {
          await firebase.auth().applyActionCode(oobCode);
          // Email verification successful. Redirect the user to your desired route.
          // Replace "http://localhost:3000/register" with the route where you want to redirect the user after successful verification.
          window.location.href = "http://localhost:3000/register";
        } else {
          console.error("Error: oobCode not found in URL");
          //   window.location.href = "/verification-failed";
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        // window.location.href = "/verification-failed";
      }
    };

    verifyEmail();
  }, [oobCode]);

  return (
    <div>
      <p>Verifying your email...</p>
    </div>
  );
};

export default EmailVerification;
