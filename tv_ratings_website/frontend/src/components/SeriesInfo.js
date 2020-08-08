import React, { Component } from "react";
import axios from "axios";

class SeriesInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        idk: 'lol'
      }
    };
  }
  refreshList = () => {
    axios.get("http://localhost:8000/api/series/tt0412142/")
      .then(res => this.setState({ info: res.data }))
      .catch(err => console.log(err));
  }
  componentDidMount() {
    this.refreshList();
  }
  render () {
    return (
      <div className="series-info">
        <p></p>
      </div>
    );
  }
}

export default SeriesInfo;
