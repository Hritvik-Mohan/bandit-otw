import { useState } from "react";

export default function Form() {

  const [url, setUrl] = useState();

  const handleClick = (e) => {
    e.preventDefault;
    console.log(url);
  }

  return (
    <div className="App">
      <div>
        <label>Add URL here: </label>
      </div>
      <div>
        <input type='url' className="form-input" onChange={(e) => setUrl(e.target.value)}/>
      </div>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}
