import React from "react";
import style from "./ContributorCard.module.css";

const ContributorCard = ({ contributor }) => {
  return (
    <div className={style.contributorCard}>
      <img
        src={contributor.image}
        alt={`${contributor.name} avatar`}
        className={style.avatar}
      />
      <div className={style.contributorDetails}>
        <h2 className={style.contributorName}>{contributor.name}</h2>
        <p className={style.contributorRole}>
          {contributor.role}
        </p>
      </div>
    </div>
  );
};

export default ContributorCard;
