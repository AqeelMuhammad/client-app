import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let history = useHistory();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        .get("https://blog-app-server-4f5eb8f1732e.herokuapp.com/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.allPosts);
          setLikedPosts(
            response.data.postsLikedByUser.map((like) => {
              return like.blogId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "https://blog-app-server-4f5eb8f1732e.herokuapp.com/like",
        { blogId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, likes: [...post.likes, 0] };
              } else {
                const likeArray = post.likes;
                likeArray.pop();
                return { ...post, likes: likeArray };
              }
            } else {
              return post;
            }
          })
        );
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };
  return (
    <div>
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
              <div className="username">
                <Link to={`/profile/${value.userId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                {likedPosts.includes(value.id) ? (
                  <ThumbUpAltIcon
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                  />
                ) : (
                  <ThumbUpOffAltIcon
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                  />
                )}
                {/* <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                /> */}

                <label>{value.likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
