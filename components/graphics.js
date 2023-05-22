import { Stage, Graphics, useApp } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";

export default function Graphs({ lines, setLines }) {
  const app = useApp();
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(1, 0xffd900, 1);
      g.moveTo(50, 50);
      for (const line of lines) {
        g.drawRect(line.x, line.y, 20, 20);
      }
    },
    [lines]
  );
  useEffect(() => {
    app.renderer.view.addEventListener("pointerdown", (e) =>
      setLines((prevItems) => [...prevItems, { x: e.pageX, y: e.pageY }])
    );
  }, []);
  return <Graphics draw={draw}></Graphics>;
}
