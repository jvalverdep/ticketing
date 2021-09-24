import Router from "next/router";
import { useRef } from "react";
import useRequest from "../../hooks/use-request";

const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    doRequest({
      email,
      password,
    });
  };

  return (
    <form className="row" onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input ref={emailRef} className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input ref={passwordRef} type="password" className="form-control" />
      </div>
      {errors}
      <div className="mb-3">
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUp;
