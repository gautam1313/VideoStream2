import React from "react";

const Card = ({ thumbnail }) => {
  return <img className="card" src={thumbnail.url} />;
};

export default Card;
