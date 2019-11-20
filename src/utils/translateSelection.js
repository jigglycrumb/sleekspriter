import { Point } from "../classes";

function translateSelection(selection, distance) {
  const translatedSelection = {
    start: new Point(selection.start.x, selection.start.y).translate(distance),
    end: new Point(selection.end.x, selection.end.y).translate(distance),
  };

  return translatedSelection;
}

export default translateSelection;
