import { useCallback, useState } from "react";
import { Layer, Line, Stage, Rect } from "react-konva";
import NoSSRWrapper from "../components/nossr";

export default function Home() {
  const [lines, setLines] = useState([]);
  const [virtualLine, setVirtualLine] = useState(null);
  const [drawingLine, setDrawingLine] = useState(false);
  const addLine = (line) => {
    setLines((prevState) => [...prevState, line]);
  };
  const lineCreation = (e) => {
    const { x, y } = e.evt;
    if (drawingLine) {
      setDrawingLine(false);
      addLine([virtualLine[0], virtualLine[1], x, y]);
      setVirtualLine(null);
    } else {
      setDrawingLine(true);
      const vLine = [x, y, x, y];
      setVirtualLine(vLine);
    }
  };
  const updateVirtualLine = (e) => {
    if (drawingLine) {
      const { x, y } = e.evt;
      const vLine = [virtualLine[0], virtualLine[1], x, y];
      setVirtualLine(vLine);
    }
  };
  return (
    <Stage
      width={500}
      height={500}
      onClick={lineCreation}
      onMouseMove={updateVirtualLine}
    >
      <Layer>
        <Line x={0} y={0} points={[100, 300, 50, 400]} closed stroke='black' />
        {virtualLine !== null && (
          <Line x={0} y={0} points={virtualLine} closed stroke='black' />
        )}
        {lines.length > 0 &&
          lines.map((line) => (
            <Line x={0} y={0} points={line} closed stroke='black' />
          ))}
      </Layer>
    </Stage>
  );
}
