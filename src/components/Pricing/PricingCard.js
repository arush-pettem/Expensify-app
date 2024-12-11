import React, { useState } from "react";
import "./PricingCard.css";
import { Line } from "@ant-design/charts";
import { Link } from "react-router-dom";

const PricingCard = ({ title, price, storage, users, sendUp, extraFeatures }) => {
  const [showMore, setShowMore] = useState(false);

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="PricingCard">
      <header>
        <p className="card-title">{title}</p>
        <h1 className="card-price">{price}</h1>
      </header>
      {/* features here */}
      <div className="card-features">
        <div className="card-storage">{storage}</div>
        <div className="card-users-allowed">{users} users in total</div>
        <div className="card-send-up">Send up to {sendUp}</div>
        {extraFeatures && showMore && (
          <div className="card-extra-features">
            {extraFeatures.map((feature, index) => (
              <div key={index}>{feature}</div>
            ))}
          </div>
        )}
      </div>
      <p  style={{ color: 'black', lineHeight : 1, padding: 20 , cursor:"pointer" }} onClick={handleReadMore}>
        {showMore ? "SHOW LESS" : "READ MORE"}
      </p>
      <Link  to="/dashboard"><button className="card-btn"  >Pay Now</button></Link>
      
    </div>
  );
};

export default PricingCard;
