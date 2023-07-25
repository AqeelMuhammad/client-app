import React, { useContext, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const login = () => {
    axios
      .post(`https://blog-app-server-4f5eb8f1732e.herokuapp.com/auth/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          history.push("/");
        }
        console.log(response.data);
      });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;
