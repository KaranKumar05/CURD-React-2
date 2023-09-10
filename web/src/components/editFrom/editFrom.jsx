import axios from "axios";

baseUrl = "http://localhost:4000";

const EditFrom = () => {
  const saveEditedPostFunction = async (e) => {
    e.preventDefault();
    const [isLoading, setIsLoading] = useState(false); //Display Loading.... Text
    const [alert, setAlert] = useState(null); //Print Server Respond
    const [allPosts, setAllPosts] = useState([]); //Print All Posts. As States Changes component will reRender
    const [toggleRefresh, setToggleRefresh] = useState(false); //Toggle Refresh Button

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

  <form onSubmit={saveEditedPostFunction}>
    <input type="text" value={post._id} disabled hidden />
    <br />
    <input type="text" defaultValue={post.title} placeholder="Post Title" />
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
  </form>;
};

export default EditFrom;
