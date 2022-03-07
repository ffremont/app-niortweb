import React from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  applyActionCode,
} from "firebase/auth";
import historyService from "../../services/history.service";

class EmailCheck extends React.Component<
  { history: any; match: any; location: any },
  {}
> {
  componentWillUnmount() {}

  componentDidMount() {
    historyService.on(window.location.pathname);
    const auth = getAuth();
    if (!auth) return;

    const params = new URLSearchParams(window.location.search);
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (
        params.get("continueUrl") &&
        !params.get("continueUrl")?.startsWith(window.location.origin)
      ) {
        window.location.href = `${params.get("continueUrl")}/email-check${
          window.location.search
        }`;
        return;
      }

      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email =
          window.prompt("Merci de saisir votre email pour confirmation") || "";
      }

      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result: any) => {
          window.localStorage.removeItem("emailForSignIn");
          this.props.history.push("/");
        })
        .catch((error: any) => {
          console.error(error);
          this.props.history.push("/error");
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    } else {
      // si on est pas auth.
      applyActionCode(auth, params.get("oobCode") || "")
        .then((e: any) => {
          window.localStorage.removeItem("emailForSignIn");
          window.location.href = params.get("continueUrl") || "/";
        })
        .catch(() => this.props.history.push("/error"));
    }
  }

  render() {
    return <div className="email-check"></div>;
  }
}

export default EmailCheck;
