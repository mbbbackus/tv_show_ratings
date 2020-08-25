import { Tooltip } from 'recharts';

let tvTestCardColors = [ "#FFFD38", "#0B24FA", "#FB0D1C", "#FD28FC", "#2AFD2F", "#2DFFFE"];

class ColoredCursor extends Tooltip {
  constructor(props){ 
    super(props);
  }
  componentDidUpdate() {
    this.updateBBox();
    if (!this.props.payload) return;
    if (this.props.payload.length > 0) {
      let seasonNum = this.props.payload[0].payload.season_number;
      let colorIndex = seasonNum % 6;
      this.props.cursor.stroke = tvTestCardColors[colorIndex];
    }
  }
}

export default ColoredCursor;
