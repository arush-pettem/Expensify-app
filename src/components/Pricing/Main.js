import { useState } from "react";
import React from "react";
import PricingCard from "./PricingCard";
import "./PricingApp.css";

const Main = () => {
  const [selectMonthly, setSelectMonthly] = useState(true);

  return (
    <div className="PricingApp">
      <div className="app-container">
        {/* Header */}
        <header>
          <h1 className="header-topic">Our Pricing Plan</h1>
          <div className="header-row">
            <p>Annually</p>
            <label className="price-switch">
              <input
                className="price-checkbox"
                onChange={() => {
                  setSelectMonthly((prev) => !prev);
                }}
                type="checkbox"
              />
              <div className="switch-slider"></div>
            </label>
            <p>Monthly</p>
          </div>
        </header>
        {/* Cards here */}
        <div className="pricing-cards">
          <PricingCard
            title="Starter Pack"
            price={selectMonthly ? "$0.00" : "$0.00"}
            users="1"
            sendUp="1"
          />
          <PricingCard
            title="Essential"
            price={selectMonthly ? "$20.99" : "$188.9"}
            storage="60 GB Storage"
            users="5"
            sendUp="5"
            extraFeatures={["Priority support", "Advanced analytics", "Expense tracking"]}
          />
          <PricingCard
            title="Premium"
            price={selectMonthly ? "$34.99" : "$349.9"}
            storage="70 GB Storage"
            users="15"
            sendUp="15"
            extraFeatures={["Personal account manager", "Unlimited storage", "Custom expense reports"]}
          />
         
        </div>
      </div>
    </div>
  );
};

export default Main;
