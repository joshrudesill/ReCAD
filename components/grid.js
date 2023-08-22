import { useEffect, useRef } from "react";
import { Circle, Group, Line } from "react-konva";

export default function Grid() {
  const spacing = 100;
  const linesCount = 10000 / spacing;
  //shape cache eventually
  const gRef = useRef(null);
  useEffect(() => {
    if (gRef.current.node !== null) {
      gRef.current.cache();
      console.log(gRef.current);
    }
  }, [gRef]);
  return (
    <>
      <Group
        ref={gRef}
        hitStrokeWidth={0}
        listening={false}
        perfectDrawEnabled={false}
      >
        {Array.from(Array(linesCount).keys()).map((line) => (
          <Line
            points={[
              -5000 + line * spacing,
              -5000,
              -5000 + line * spacing,
              5000,
            ]}
            closed
            strokeWidth={0.1}
            stroke='grey'
            key={line}
            hitStrokeWidth={0}
            listening={false}
            perfectDrawEnabled={false}
          />
        ))}
        {Array.from({ length: linesCount }).map((line) => (
          <Line
            points={[
              -5000,
              -5000 + line * spacing,
              5000,
              -5000 + line * spacing,
            ]}
            closed
            strokeWidth={0.1}
            stroke='grey'
            hitStrokeWidth={0}
            listening={false}
            key={line}
            perfectDrawEnabled={false}
          />
        ))}
        <Line
          points={[0, -5000, 0, 5000]}
          closed
          strokeWidth={0.5}
          hitStrokeWidth={0}
          listening={false}
          stroke='black'
          perfectDrawEnabled={false}
        />
        <Line
          points={[-5000, 0, 5000, 0]}
          closed
          strokeWidth={0.5}
          hitStrokeWidth={0}
          listening={false}
          stroke='black'
          perfectDrawEnabled={false}
        />
        <Circle
          x={0}
          y={0}
          radius={5}
          fill='green'
          listening={false}
          perfectDrawEnabled={false}
        />
      </Group>
    </>
  );
}
