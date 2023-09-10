import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Icon from 'react-bootstrap-icons';
import "./home.css";

const baseUrl = "http://localhost:4000";
const Home = () => {
  //-----Taking Input from user-----//
  const postTitleInput = useRef(null);
  const postTextInput = useRef(null);

  //-----State-----//
  const [isLoading, setIsLoading] = useState(false); //Display Loading.... Text
  const [alert, setAlert] = useState(null); //Print Server Respond
  const [allPosts, setAllPosts] = useState([]); //Print All Posts. As States Changes component will reRender
  const [toggleRefresh, setToggleRefresh] = useState(false); //Toggle Refresh Button
  // const [editAlert, setEditAlert] = useState(false); //Toggle Refresh Button

  // Function to get all Post
  const getAllPost = async () => {
    try {
      setIsLoading(true);
      //----Api Call----//(Get All Posts)
      const response = await axios.get(`${baseUrl}/api/v1/posts`); //As Component Renders Run the API and Get all posts
      console.log(response.data);

      setIsLoading(false);
      setAllPosts(response.data);
    } catch (error) {
      // console.log(error?.data);
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  //---UseEffect Execute When Component Render---//
  useEffect(() => {
    getAllPost(); //Load All Post When Component Render
  }, [toggleRefresh]);

  //---- PostHandler Function ----//
  const postHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      //----Api Call----//(Create Post)
      const response = await axios.post(`${baseUrl}/api/v1/post`, {
        //----Data----//
        title: postTitleInput.current.value,
        text: postTextInput.current.value,
      });
      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh); //Toggle Refresh Button
    } catch (error) {
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  //---- deletePostFunction ----//
  const deletePostFunction = async (_id) => {
    try {
      setIsLoading(true);

      //----Api Call----//(Create Post)
      const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`);
      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh); //Toggle Refresh Button
    } catch (error) {
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  //----- Function to Save Edited Post -----//
  const saveEditedPostFunction = async (e) => {
    e.preventDefault();
    const _id = e.target[0].value;
    const title = e.target[1].value;
    const text = e.target[2].value;

    try {
      setIsLoading(true);
      //----Api Call----//(Create Post)
      const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
        //----Data----//
        title: title,
        text: text,
      });
      setIsLoading(false);
      console.log(response.data);
      setAlert(response?.data?.message);
      setToggleRefresh(!toggleRefresh); //Toggle Refresh Button
    } catch (error) {
      console.log(error?.data);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={postHandler} className="postForm form">
        <input
          type="text"
          id="postTitleInput"
          placeholder="Post Title"
          ref={postTitleInput}
          required
        />
        <textarea
          id="postTextInput"
          ref={postTextInput}
          cols="20"
          rows="5"
          placeholder="What's on your mind"
          required
        ></textarea>
        <div>
          <button type="submit">Publish Post</button>
          <span>
            {alert && alert} {/* Server Respond */}
            {isLoading && "Loading.."}
            {/* Loading.... Text */}
          </span>
        </div>
      </form>
      <br />
      <div>
        {allPosts.map((post, index) => (
          <div key={post._id}>
            {post.isEdit ? (
              <form onSubmit={saveEditedPostFunction}>
                <input type="text" value={post._id} disabled hidden />
                <br />
                <input
                  type="text"
                  defaultValue={post.title}
                  placeholder="Post Title"
                />
                <br />
                <textarea
                  name=""
                  id=""
                  cols="20"
                  rows="5"
                  defaultValue={post.text}
                  placeholder="Text"
                ></textarea>
                <br />
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={(e) => {
                    post.isEdit = false;
                    setAllPosts([...allPosts]);
                  }}
                >
                  Cancel
                </button>
                <span>
                  {alert && alert} {/* Server Respond */}
                  {isLoading && "Loading.."}
                </span>
              </form>
            ) : (
              <div className="postCardContainer">
                <div className="postCard">
                  <h2>{post.title}</h2>
                  <p>{post.text}</p>
                  <div>
                    <button
                      onClick={(e) => {
                        allPosts[index].isEdit = true;
                        setAllPosts([...allPosts]);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        deletePostFunction(post._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
