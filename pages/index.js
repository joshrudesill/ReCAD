import Graphs from "@/components/graphics";
import { Stage, Graphics, useApp } from "@pixi/react";
import { useCallback, useState } from "react";

export default function Home() {
  const [lines, setLines] = useState([{ x: 100, y: 75 }]);

  return (
    <div>
      <Stage height={700} width={700}>
        <Graphs lines={lines} setLines={setLines} />
      </Stage>
    </div>
  );
}
