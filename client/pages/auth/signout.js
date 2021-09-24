import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const SignOut = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => setTimeout(() => Router.push("/"), 2000),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>You're being signed out...</div>;
};

export default SignOut;
