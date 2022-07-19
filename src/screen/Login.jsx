import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import api from "../assets/JsonData/api.json";
import { checkToken } from "../service";
import { Account } from "../Model";
import "./login.css";
export const Login = () => {
  const [show, setShow] = useState(false);
  const history = useHistory();
  const [account, setAccount] = useState(new Account());
  const [status, setStatus] = useState(1);
  const handleChange = (e) => {
    e.persist();
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    checkToken().then((res) => {
      if (res === 1) {
        history.push("/");
      }
    });
  }, [history]);

  const login = () => {
    Axios.post(
      api.find((e) => e.pages === "Đăng nhập").api["login"],
      account
    ).then((res) => {
      if (res.status === 200) {
        console.log("token: " + res.data.result.tokens);
        localStorage.setItem("token-admin", res.data.result.tokens);
        history.push("/");
        console.log(res.data);
        localStorage.setItem("admin", JSON.stringify(account));
        setAccount(new Account());
      }
    });
  };
  const resetPass = () => {};
  return (
    <div>
      <div className="login-pages">
        <div className="center">
          <div className="header">
            <div className={`login ${status === 1 ? "active" : ""}`}>
              <button onClick={() => setStatus(1)}>ログイン</button>
            </div>
            <div className={`reset-pass ${status === 2 ? "active" : ""}`}>
              <button onClick={() => setStatus(2)}>パスワード編集</button>
            </div>
          </div>
          <div className="body">
            <div className="input-group">
              <i className="bx bx-user-circle"></i>
              <input
                type="text"
                placeholder="アカウント"
                name="email"
                value={account.account}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="input-group">
              <i
                className="bx bxs-low-vision"
                onClick={() => setShow(!show)}
              ></i>
              <input
                type={show ? "text" : "password"}
                placeholder="パスワード"
                name="password"
                value={account.password}
                onChange={(e) => handleChange(e)}
              />
            </div>
            {status === 1 ? (
              ""
            ) : (
              <div className="input-group">
                <i className="bx bxs-low-vision"></i>
                <input
                  type="password"
                  placeholder="パスワード"
                  name="resetPass"
                  value={account.resetPass}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            )}
            <button onClick={status === 1 ? login : resetPass}>
              {status === 1 ? "ログイン" : "パスワード編集"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
