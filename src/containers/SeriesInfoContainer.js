import React, { Component } from "react";
import axios from "axios";
import SeriesInfo from '../components/SeriesInfo';

class SeriesInfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        episodes: [],
        unrated: [],
      },
      cast: [],
    };
    this.cleanSeriesInfo = this.cleanSeriesInfo.bind(this);
    this.compareRating = this.compareRating.bind(this);
  }
  compareRating (a, b) {
    if (a.average_rating > b.average_rating) return 1;
    if (a.average_rating < b.average_rating) return -1;
    return 0;
  }
  cleanSeriesInfo(info) {
    let sortedInfo = info;
    sortedInfo.episodes = info.episodes.map(episode => (
      {
        episode_number: episode.episode_number,
        season_number: episode.season_number,
        average_rating: (episode.ratings.length > 0 ? episode.ratings[0].average_rating : -1),
        num_votes: (episode.ratings.length > 0 ? episode.ratings[0].num_votes : -1),
        name: (episode.names.length > 0 ? episode.names[0].primary_name : -1),
        id: episode.id,
      }
    ));
    function compare(a, b) {
      let aSeason = a.season_number;
      let bSeason = b.season_number;
      if (aSeason > bSeason) return 1;
      if (aSeason < bSeason) return -1;
      let aEpiNum = a.episode_number;
      let bEpiNum = b.episode_number;
      if (aEpiNum > bEpiNum) return 1;
      if (aEpiNum < bEpiNum) return -1;
      return 0;
    }
    sortedInfo.episodes.sort(compare);

    let ratedInfo = {...sortedInfo}
    ratedInfo.episodes = [];


    let unrated = []; // CONVERT UNRATED SORTING INTO FUNCTION AND APPLY TO CLEANCAST TO FIX BETTER CALL SAUL SEASON 6
                      // ALSO SOME SHOWS ARE STILL BROKEN: Mad men and Deep Space 9 for Betty Draper and Cpt. Sisko
    for (let i = 0; i < sortedInfo.episodes.length; i++) {
      if (sortedInfo.episodes[i].average_rating === -1) {
        unrated.push(sortedInfo.episodes[i]);
      } else {
        ratedInfo.episodes.push(sortedInfo.episodes[i]);
      }
    }

    return {
      info: ratedInfo,
      unrated: unrated
    };
  }
  cleanCast(episodes) {
    let cleanCast = {};
    function compare(a, b) {
      const aSeason = a.season_number;
      const bSeason = b.season_number;
      if (aSeason > bSeason) return 1;
      if (aSeason < bSeason) return -1;
      const aEpiNum = a.episode_number;
      const bEpiNum = b.episode_number;
      if (aEpiNum > bEpiNum) return 1;
      if (aEpiNum < bEpiNum) return -1;
      return 0;
    }
    const unratedIds = this.state.unrated.map(ep => ep.id);
    let eps = [];
    for (let i = 0; i < episodes.length; i++) {
      if (unratedIds.indexOf(episodes[i].id) >= 0) continue;
      eps.push(episodes[i]);
    }
    episodes = eps.sort(compare);
    console.log(episodes);
    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i];
      for (let j = 0; j < episode.appearances.length; j++) {
        const ep = episode.appearances[j];
        const actor = ep.actor.primary_name;
        const character = ep.characters.slice(2,ep.characters.length-2);

        if (!(actor in cleanCast)) { // on first appearance of an actor
          let zero_arr = new Array(episodes.length).fill(0);
          cleanCast[actor] = {
            appearances: zero_arr,
            characters: [character]
          };
        }
        cleanCast[actor].appearances[i] = 1;
        if (episode.episode_number === 1) {
          cleanCast[actor].appearances[i] += 1; //has nothing to do with relevance but seems negligible
        }
        if (cleanCast[actor].characters.indexOf(character) < 0 && !(character.includes("uncredited") || character.includes("voice)"))) {
          cleanCast[actor].characters.push(character);
        }
      }
    }
    let castMatrix = Object.keys(cleanCast).map(actor => 
      [
        actor, //actor name
        cleanCast[actor].appearances.reduce((a,b)=>a+b,0), //actor relevance in the show
        cleanCast[actor].appearances, // binary matrix of appearances
        cleanCast[actor].characters.join(", ") //characters played by actor
      ]
    );

    castMatrix.sort((a,b) => b[1] - a[1]);
    return {cast: castMatrix};
  }
  loadSeries = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("/api/series/" + series_uuid)
      .then(res => this.setState(this.cleanSeriesInfo(res.data)))
      .catch(err => console.log(err));
  }
  loadCast = () => {
    const series_uuid = this.props.match.params.seriesId;
    axios.get("/api/cast/" + series_uuid)
      .then(res => this.setState(this.cleanCast(res.data['episodes'])))
      .catch(err => console.log(err));
  }
  componentDidMount() {
    this.loadSeries();
    this.loadCast();
  }
  render () {
    document.title = "Plot the plot";
    if (this.state.info.primary_title)
      document.title = "Plot the plot | " + this.state.info.primary_title;
    return (
      <SeriesInfo
        info={this.state.info}
        cast={this.state.cast}
        unratedEpisodes={this.state.unrated}
        compareRating={this.compareRating}
      />
    );
  }
}

export default SeriesInfoContainer;
