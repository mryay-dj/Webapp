"use client";
import React, { useState } from 'react';

interface ListItem {
  videoUrl: string;
  title: string;
  description: string;
  timestamp: string;
}

const VideoList: React.FC<{ items: ListItem[] }> = ({ items }) => {
  const [selectedVideo, setSelectedVideo] = useState<ListItem | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);

  const openModal = (item: ListItem) => {
    setSelectedVideo(item);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const handleLike = () => {
    setLikeCount(likeCount + 1);
    // Additional logic: You can send a request to update like count on the backend here
  };

  const handleDislike = () => {
    setDislikeCount(dislikeCount + 1);
    // Additional logic: You can send a request to update dislike count on the backend here
  };
  return (
    <div className="video-list-container">
      {items.map((item, index) => (
        <div key={index} className="video-list-item" onClick={() => openModal(item)}>
          <div className="video">
            <video src={item.videoUrl} controls />
          </div>
          <div className="details">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="timestamp">{item.timestamp}</span>
          </div>
        </div>
      ))}

      {/* Popup */}
      {selectedVideo && (
     <div className="popup">
     <div className="popup-content">
       <span className="close" onClick={closeModal}>
         &times;
       </span>
       <video src={selectedVideo.videoUrl} controls className="popup-video"/>
       <br></br>
       <h2>{selectedVideo.title}</h2>
       <br></br>
       <p>{selectedVideo.description}</p>
       <div className="like-dislike">
         <button className="like-button" onClick={handleLike}>
           Like
         </button>
         <button className="dislike-button" onClick={handleDislike}>
           Dislike
         </button>
         <br></br>
         <br></br>
         <button
           className="submit-button"
           type="submit"
         >
           Submit
         </button>
       </div>
     </div>
   </div>
   
      )}
    </div>
  );
};

export default VideoList;
