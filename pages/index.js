import { Stage, Sprite, Graphics } from "@pixi/react";
import { useCallback } from "react";

export default function Home() {
  const draw = useCallback((g) => {
    g.clear();
    g.lineStyle(1, 0xffd900, 1);
    g.moveTo(50, 50);
    g.lineTo(25, 50);
    g.lineTo(100, 100);
  }, []);
  return (
    <div>
      <Stage height={700} width={700} onMouseDown={(e) => console.log(e)}>
        <Graphics draw={draw}></Graphics>
      </Stage>
    </div>
  );
}
