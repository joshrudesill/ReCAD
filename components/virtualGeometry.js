import { Circle, Group, Line, Rect, RegularPolygon, Shape } from "react-konva";
import { useSelector } from "react-redux";
import { get_distance_4p } from "@/pkg/recad_wasm";
import { useEffect } from "react";
export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    selectedGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
  } = useSelector((state) => state.drawingControl);
  //replace^
  useEffect(() => {
    //console.log(check_line_collision(0, 0, 1, 1, 10, 10, 2, 400));
  }, []);
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === "line") {
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

    if (virtualGeometry.gType === "rect") {
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
    if (virtualGeometry.gType === "circle") {
      return (
        <>
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
            listening={false}
            hitStrokeWidth={0}
            dash={[10, 15]}
          />
          <Circle
            x={virtualGeometry.startingX}
            y={virtualGeometry.startingY}
            radius={get_distance_4p(
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY
            )}
            stroke='black'
            fillEnabled={false}
          />
        </>
      );
    }
    if (virtualGeometry.gType === "polygon") {
      // interior or exterior length eventually, right now just exterior -- TODO
      return (
        <>
          <RegularPolygon
            sides={virtualGeometry.sides}
            stroke={"black"}
            radius={get_distance_4p(
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY
            )}
            listening={false}
            hitStrokeWidth={0}
            fillEnabled={false}
            rotation={
              //in rust eventually
              (Math.atan2(
                virtualGeometry.startingY - virtualGeometry.currentY,
                virtualGeometry.startingX - virtualGeometry.currentX
              ) *
                180) /
                Math.PI -
              90
            }
            x={virtualGeometry.startingX}
            y={virtualGeometry.startingY}
          />
          <Circle
            x={virtualGeometry.startingX}
            y={virtualGeometry.startingY}
            radius={get_distance_4p(
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY
            )}
            stroke='black'
            dash={[10, 15]}
            fillEnabled={false}
            listening={false}
          />
        </>
      );
    }
    if (virtualGeometry.gType === "curve") {
      return (
        <>
          <Shape
            stroke={"black"}
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(
                virtualGeometry.startingX,
                virtualGeometry.startingY
              );
              context.quadraticCurveTo(
                virtualGeometry.currentX,
                virtualGeometry.currentY,
                virtualGeometry.endingX
                  ? virtualGeometry.endingX
                  : virtualGeometry.currentX,
                virtualGeometry.endingY
                  ? virtualGeometry.endingY
                  : virtualGeometry.currentY
              );
              context.fillStrokeShape(shape);
              // Basis for custom bezier
            }}
          />
          <Line
            stroke={"black"}
            points={[
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY,
            ]}
            dash={[10, 15]}
            listening={false}
          />
        </>
      );
    }
    if (virtualGeometry.gType === "cap") {
      return (
        <>
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.arc(
                (virtualGeometry.currentX + virtualGeometry.startingX) * 0.5,
                (virtualGeometry.currentY + virtualGeometry.startingY) * 0.5,
                get_distance_4p(
                  virtualGeometry.startingX,
                  virtualGeometry.startingY,
                  virtualGeometry.currentX,
                  virtualGeometry.currentY
                ) * 0.5,
                Math.atan2(
                  virtualGeometry.currentY - virtualGeometry.startingY,
                  virtualGeometry.currentX - virtualGeometry.startingX
                ),
                Math.atan2(
                  virtualGeometry.currentY - virtualGeometry.startingY,
                  virtualGeometry.currentX - virtualGeometry.startingX
                ) + Math.PI,
                false
              );
              context.stroke();
            }}
            stroke='black'
            strokeWidth={2}
          />
          <Circle
            x={(virtualGeometry.currentX + virtualGeometry.startingX) * 0.5}
            y={(virtualGeometry.currentY + virtualGeometry.startingY) * 0.5}
            radius={3}
            stroke={"black"}
            fill='red'
          />
          <Line
            points={[
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY,
            ]}
            stroke={"black"}
            dash={[10, 15]}
          />
        </>
      );
    }
  } else if (virtualGeometryBeingAltered) {
    if (geometryAugment.type === "copy" || geometryAugment.type === "move") {
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
            {selectedGeometry.map((geo, i) => {
              if (geo.gType === "line") {
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
                    key={i}
                  />
                );
              }
              if (geo.gType === "rect") {
                return (
                  <Rect
                    x={geo.startingX}
                    y={geo.startingY}
                    width={-(geo.startingX - geo.endingX)}
                    height={-(geo.startingY - geo.endingY)}
                    closed
                    stroke='black'
                    key={i}
                  />
                );
              }
              if (geo.gType === "circle") {
                return (
                  <Circle
                    x={geo.startingX}
                    y={geo.startingY}
                    radius={get_distance_4p(
                      geo.startingX,
                      geo.startingY,
                      geo.endingX,
                      geo.endingY
                    )}
                    closed
                    stroke='black'
                    key={i}
                  />
                );
              }
              if (geo.gType === "polygon") {
                return (
                  <RegularPolygon
                    sides={geo.sides}
                    stroke={"black"}
                    radius={get_distance_4p(
                      geo.startingX,
                      geo.startingY,
                      geo.endingX,
                      geo.endingY
                    )}
                    listening={false}
                    hitStrokeWidth={0}
                    fillEnabled={false}
                    rotation={
                      //in rust eventually
                      (Math.atan2(
                        geo.startingY - geo.endingY,
                        geo.startingX - geo.endingX
                      ) *
                        180) /
                        Math.PI -
                      90
                    }
                    x={geo.startingX}
                    y={geo.startingY}
                  />
                );
              }
              if (geo.gType === "curve") {
                return (
                  <Shape
                    hitStrokeWidth={0}
                    listening={false}
                    onClick={() => dispatch(addSelectedGeometry(geo))}
                    stroke={
                      selectedGeometry.length > 0
                        ? selectedGeometry.some((g) => g.key === geo.key)
                          ? "red"
                          : "black"
                        : "black"
                    }
                    sceneFunc={(context, shape) => {
                      context.beginPath();
                      context.moveTo(geo.startingX, geo.startingY);
                      context.quadraticCurveTo(
                        geo.quadraticCurveAnchor.x,
                        geo.quadraticCurveAnchor.y,
                        geo.endingX,
                        geo.endingY
                      );
                      context.fillStrokeShape(shape);
                      // Basis for custom bezier
                    }}
                  />
                );
              }
              if (geo.gType === "cap") {
                return (
                  <Shape
                    hitStrokeWidth={0}
                    listening={false}
                    sceneFunc={(context, shape) => {
                      context.beginPath();
                      context.arc(
                        (geo.endingX + geo.startingX) * 0.5,
                        (geo.endingY + geo.startingY) * 0.5,
                        get_distance_4p(
                          geo.startingX,
                          geo.startingY,
                          geo.endingX,
                          geo.endingY
                        ) * 0.5,
                        Math.atan2(
                          geo.endingY - geo.startingY,
                          geo.endingX - geo.startingX
                        ),
                        Math.atan2(
                          geo.endingY - geo.startingY,
                          geo.endingX - geo.startingX
                        ) + Math.PI,
                        false
                      );
                      context.fillStrokeShape(shape);
                    }}
                    fillEnabled={false}
                    onClick={() => dispatch(addSelectedGeometry(geo))}
                    stroke={
                      selectedGeometry.length > 0
                        ? selectedGeometry.some((g) => g.key === geo.key)
                          ? "red"
                          : "black"
                        : "black"
                    }
                  />
                );
              }
            })}
          </Group>
        </>
      );
    }
    if (geometryAugment.type === "array") {
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
          {Array.from({ length: geometryAugment.copies }).map(
            (item, iteration) => (
              <Group
                key={iteration}
                offsetX={
                  geometryAugment.start.offsetX * iteration -
                  geometryAugment.current.offsetX * iteration
                }
                offsetY={
                  geometryAugment.start.offsetY * iteration -
                  geometryAugment.current.offsetY * iteration
                }
              >
                {selectedGeometry.map((geo, i) => {
                  if (geo.gType === "line") {
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
                        key={i}
                      />
                    );
                  }
                  if (geo.gType === "rect") {
                    return (
                      <Rect
                        x={geo.startingX}
                        y={geo.startingY}
                        width={-(geo.startingX - geo.endingX)}
                        height={-(geo.startingY - geo.endingY)}
                        closed
                        stroke='black'
                        key={i}
                      />
                    );
                  }
                  if (geo.gType === "circle") {
                    return (
                      <Circle
                        x={geo.startingX}
                        y={geo.startingY}
                        radius={get_distance_4p(
                          geo.startingX,
                          geo.startingY,
                          geo.endingX,
                          geo.endingY
                        )}
                        closed
                        stroke='black'
                        key={i}
                      />
                    );
                  }
                  if (geo.gType === "polygon") {
                    return (
                      <RegularPolygon
                        sides={geo.sides}
                        stroke={"black"}
                        radius={get_distance_4p(
                          geo.startingX,
                          geo.startingY,
                          geo.endingX,
                          geo.endingY
                        )}
                        listening={false}
                        hitStrokeWidth={0}
                        fillEnabled={false}
                        rotation={
                          //in rust eventually
                          (Math.atan2(
                            geo.startingY - geo.endingY,
                            geo.startingX - geo.endingX
                          ) *
                            180) /
                            Math.PI -
                          90
                        }
                        x={geo.startingX}
                        y={geo.startingY}
                        key={i}
                      />
                    );
                  }
                  if (geo.gType === "curve") {
                    return (
                      <Shape
                        hitStrokeWidth={0}
                        listening={false}
                        onClick={() => dispatch(addSelectedGeometry(geo))}
                        stroke={
                          selectedGeometry.length > 0
                            ? selectedGeometry.some((g) => g.key === geo.key)
                              ? "red"
                              : "black"
                            : "black"
                        }
                        key={i}
                        sceneFunc={(context, shape) => {
                          context.beginPath();
                          context.moveTo(geo.startingX, geo.startingY);
                          context.quadraticCurveTo(
                            geo.quadraticCurveAnchor.x,
                            geo.quadraticCurveAnchor.y,
                            geo.endingX,
                            geo.endingY
                          );
                          context.fillStrokeShape(shape);
                          // Basis for custom bezier
                        }}
                      />
                    );
                  }
                  if (geo.gType === "cap") {
                    return (
                      <Shape
                        hitStrokeWidth={0}
                        listening={false}
                        key={i}
                        sceneFunc={(context, shape) => {
                          context.beginPath();
                          context.arc(
                            (geo.endingX + geo.startingX) * 0.5,
                            (geo.endingY + geo.startingY) * 0.5,
                            get_distance_4p(
                              geo.startingX,
                              geo.startingY,
                              geo.endingX,
                              geo.endingY
                            ) * 0.5,
                            Math.atan2(
                              geo.endingY - geo.startingY,
                              geo.endingX - geo.startingX
                            ),
                            Math.atan2(
                              geo.endingY - geo.startingY,
                              geo.endingX - geo.startingX
                            ) + Math.PI,
                            false
                          );
                          context.fillStrokeShape(shape);
                        }}
                        fillEnabled={false}
                        onClick={() => dispatch(addSelectedGeometry(geo))}
                        stroke={
                          selectedGeometry.length > 0
                            ? selectedGeometry.some((g) => g.key === geo.key)
                              ? "red"
                              : "black"
                            : "black"
                        }
                      />
                    );
                  }
                })}
              </Group>
            )
          )}
        </>
      );
    }
  }
}
