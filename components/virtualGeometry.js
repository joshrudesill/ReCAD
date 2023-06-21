import { Circle, Group, Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    selectedGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
  } = useSelector((state) => state.drawingControl);
  //replace^
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === 1) {
      return (
        <Line
          x={0}
          y={0}
          points={[
            virtualGeometry.startingX,
            virtualGeometry.startingY,
            virtualGeometry.currentX,
            virtualGeometry.currentY,
          ]}
          closed
          stroke='black'
        />
      );
    }
    //starting = 0.75
    //inverse 1 / 0.75 = 1.33
    //zoom out
    // new scale = 0.5
    //inverse = 2
    //cursor at 50,50
    //time initial scale 66, 66
    //needs 100,100

    //starting = 0.75
    //inverse 1 / 0.75 = 1.33
    //zoom out
    // new scale = 0.7
    //inverse = 1.43
    //cursor at 50,50
    //time initial scale 66, 66
    //needs 71.43, 71.43
    //1.0714
    if (virtualGeometry.gType === 2) {
      return (
        <Rect
          x={virtualGeometry.startingX}
          y={virtualGeometry.startingY}
          width={-(virtualGeometry.startingX - virtualGeometry.currentX)}
          height={-(virtualGeometry.startingY - virtualGeometry.currentY)}
          closed
          stroke='black'
        />
      );
    }
    if (virtualGeometry.gType === 3) {
      return (
        <Group>
          <Line
            x={0}
            y={0}
            points={[
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY,
            ]}
            closed
            stroke='black'
            dash={[10, 15]}
          />
          <Circle
            x={virtualGeometry.startingX}
            y={virtualGeometry.startingY}
            radius={parseFloat(
              Math.abs(
                Math.sqrt(
                  Math.pow(
                    virtualGeometry.startingX - virtualGeometry.currentX,
                    2
                  ) +
                    Math.pow(
                      virtualGeometry.startingY - virtualGeometry.currentY,
                      2
                    )
                )
              ).toFixed(3)
            )}
            stroke='black'
          />
        </Group>
      );
    }
  } else if (virtualGeometryBeingAltered) {
    /*
    augStart, augCurrent
     {selectedGeometry.map((geo) => {
          if (geo.gType === 1) {
            return (
              <Line
                x={geo.stageX}
                y={geo.stageY}
                points={[
                  geo.startingX,
                  geo.startingY,
                  geo.currentX,
                  geo.currentY,
                ]}
                closed
                stroke='black'
              />
            );
          }
          if (geo.gType === 2) {
            return (
              <Rect
                x={(geo.startingX + stageOffset.x) * stageZoomScaleInverse}
                y={(geo.startingY + stageOffset.y) * stageZoomScaleInverse}
                width={
                  -(geo.startingX - virtualGeometry.currentX) *
                  stageZoomScaleInverse
                }
                height={
                  -(geo.startingY - virtualGeometry.currentY) *
                  stageZoomScaleInverse
                }
                closed
                stroke='black'
              />
            );
          }
        })}
     */
    return (
      <>
        <Line
          points={[
            geometryAugment.start.offsetX,
            geometryAugment.start.offsetY,
            geometryAugment.current.offsetX,
            geometryAugment.current.offsetY,
          ]}
          closed
          stroke='black'
          strokeWidth={1}
          dash={[10, 15]}
        />
        <Group
          offsetX={
            geometryAugment.start.offsetX - geometryAugment.current.offsetX
          }
          offsetY={
            geometryAugment.start.offsetY - geometryAugment.current.offsetY
          }
        >
          {selectedGeometry.map((geo) => {
            if (geo.gType === 1) {
              return (
                <Line
                  points={[
                    geo.startingX,
                    geo.startingY,
                    geo.endingX,
                    geo.endingY,
                  ]}
                  closed
                  stroke='black'
                />
              );
            }
            if (geo.gType === 2) {
              return (
                <Rect
                  x={geo.startingX}
                  y={geo.startingY}
                  width={-(geo.startingX - geo.endingX)}
                  height={-(geo.startingY - geo.endingY)}
                  closed
                  stroke='black'
                />
              );
            }
            if (geo.gType === 3) {
              return (
                <Circle
                  x={geo.startingX}
                  y={geo.startingY}
                  radius={Math.abs(
                    Math.sqrt(
                      Math.pow(geo.startingX - geo.endingX, 2) +
                        Math.pow(geo.startingY - geo.endingY, 2)
                    )
                  )}
                  closed
                  stroke='black'
                />
              );
            }
          })}
        </Group>
      </>
    );
  }
}
