import React, { Component } from "react";

const CustomTooltip = ({ active, payload, label, info, filteredEps, hidden }) => {
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
  if (!active) {
    let isLarge = document.getElementById("series-title").classList.contains("large-title");
    if (!isLarge) {
      document.getElementById("series-title").classList.remove("small-title");
      document.getElementById("series-title").classList.add("large-title");
    }
    document.getElementById("episode-title-container").innerHTML = "";
    return "";
  }
  if (active && payload != null) {
    let isSmall = document.getElementById("series-title").classList.contains("small-title");
    if (!isSmall) {
      document.getElementById("series-title").classList.remove("large-title");
      document.getElementById("series-title").classList.add("small-title");
    }
    document.getElementById("episode-title-container").innerHTML = `
      <span class="episode-title">
        "${episode.name}" 
      </span>
      <span class="rating">
        ${episode.average_rating}
      </span>
      <span class="rating-denominator">
        /10
      </span><br/>
      <span class="episode-number">
        (season ${episode.season_number} episode ${episode.episode_number})
      </span>
      `;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-text">
          {episode.num_votes} votes
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;