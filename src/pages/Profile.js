import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let history = useHistory();
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `https://blog-app-server-4f5eb8f1732e.herokuapp.com/auth/basicinfo/${id}`
      )
      .then((response) => {
        setUsername(response.data.username);
      });

    axios
      .get(
        `https://blog-app-server-4f5eb8f1732e.herokuapp.com/posts/byUser/${id}`
      )
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="BasicInfo">
        <h1>Username : {username}</h1>
        {authState.username === username && (
          <button
            onClick={() => {
              history.push("/changePassword");
            }}
          >
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label>{value.likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
