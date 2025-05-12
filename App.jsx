import { useState } from "react";
import "./App.css";
import { getImage, getStory } from "./apiService";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [title, setTitle] = useState(""); // State to store the entered prompt

  const handleSubmit = async () => {
    if (!title) return;

    setIsLoading(true);
    const storyList = [];

    try {
      const storyRes = await getStory(title);
      const totalStory = storyRes?.choices[0]?.message?.content;

      if (!totalStory) {
        console.error("No stories found");
        return;
      }

      const storyArray = totalStory
        .split("\n")
        .filter((story) => story.trim() !== "");

      const promises = storyArray.map(getImage);

      const responses = await Promise.allSettled(promises);

      const successfulResponses = responses.filter(
        (response) => response.status === "fulfilled"
      );

      const parsedResponses = successfulResponses.map((response) =>
        JSON.parse(response.value)
      );

      const allImages = parsedResponses.filter(
        (resp) => resp?.data[0]?.url !== undefined
      );

      for (let i = 0; i < storyArray.length; i++) {
        storyList.push({
          paragraph: storyArray[i],
          imageURL: i < allImages.length ? allImages[i].data[0].url : "",
        });
      }

      setStory(storyList);
    } catch (err) {
      console.error("Error creating story", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Story Teller</h1>
      <div className="search-bar-container">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a prompt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="submit-story-title" onClick={handleSubmit}>
          Generate
        </button>
      </div>

      <div className="story-container">
        {isLoading ? (
          <img
            src="../public/loading.gif"
            className="loading-image"
            alt="loading....."
          />
        ) : (
          story && (
            <div className="story-board">
              {story.map((storyItem, index) => {
                const { paragraph, imageURL } = storyItem;
                return (
                  <div key={index.toString()}>
                    <p className="paragraph">{paragraph}</p>
                    {imageURL && (
                      <img
                        className="story-image"
                        src={imageURL}
                        alt={`story-${index}`}
                        />
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;