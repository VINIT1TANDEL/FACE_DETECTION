import React from "react";
import "./Bubbles.css";

const BubbleAnimation = () => {
  return (
    <div className="bubble-container">
      {[...Array(20)].map((_, index) => (
        <div key={index} className="bubble"></div>
      ))}
    </div>
  );
};

export default BubbleAnimation;
