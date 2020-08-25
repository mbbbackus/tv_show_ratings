import React, { Component } from "react";

const CustomTooltip = ({ active, payload, label, info, filteredEps }) => {
  let episode = {};
  for (let i = 0; i < info.episodes.length; i++) {
    // TODO: find episode by id, not name
    if (info.episodes[i].name === label) {
      episode = info.episodes[i]; 
      break;
    } else if (filteredEps[i].name === label) {
      episode = info.episodes[i];
      break;
    }
  }
  if (active && payload != null) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-text">
          {`S${episode.season_number} E${episode.episode_number}`}, <b>{`"${episode.name}"`}</b>, {`${episode.average_rating}`}
        </p>
        <p className="tooltip-text">
          {`${episode.num_votes} votes`}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;