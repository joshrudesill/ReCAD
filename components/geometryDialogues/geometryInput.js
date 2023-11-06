import { useEffect, useState } from "react";
import { Rect, Text, Group } from "react-konva";
import { useSelector } from "react-redux";

export default function GeometryInput({
  inputRefFocus,
  setMouseInstruction,
  currentFocus,
}) {
  const stageOffset = useSelector((state) => state.drawingControl.stageOffset);
  const stageZoomScaleInverse = useSelector(
    (state) => state.drawingControl.stageZoomScaleInverse
  );
  const { showGeometryInput, geometryInputDataFields } = useSelector(
    (state) => state.UIControl
  );
  const [convertedFocus, setCF] = useState("");
  useEffect(() => {
    // Gross code but oh well
    console.log(currentFocus);
    if (currentFocus !== "") {
      var focusType = "";
      switch (currentFocus) {
        case "sx":
          focusType = "Starting X";
          break;
        case "sy":
          focusType = "Starting Y";
          break;
        case "length":
          focusType = "Length";
          break;
        case "width":
          focusType = "Width";
          break;
        case "height":
          focusType = "Height";
          break;
      }
      console.log("asdfasdf:", focusType);
      setCF(focusType);
    }
  }, [currentFocus]);

  const handleClick = (fieldName) => {
    var focusType = "";
    switch (fieldName) {
      case "Starting X":
        focusType = "sx";
        break;
      case "Starting Y":
        focusType = "sy";
        break;
      case "Length":
        focusType = "length";
        break;
      case "Width":
        focusType = "width";
        break;
      case "Height":
        focusType = "height";
        break;
    }
    inputRefFocus(focusType);
  };

  if (showGeometryInput) {
    return (
      <>
        {geometryInputDataFields.map((field, i) => {
          return (
            <Group
              onMouseEnter={() => setMouseInstruction(true)}
              onMouseLeave={() => setMouseInstruction(false)}
              x={(stageOffset.x + 10) * stageZoomScaleInverse}
              y={(15 + stageOffset.y + 55 * i) * stageZoomScaleInverse}
              onClick={() => handleClick(field.fieldName)}
            >
              <Rect
                height={40 * stageZoomScaleInverse}
                width={
                  geometryInputDataFields.length * 100 * stageZoomScaleInverse
                }
                fill='teal'
                stroke={"black"}
                strokeWidth={2 * stageZoomScaleInverse}
                strokeEnabled={convertedFocus === field.fieldName}
                cornerRadius={10 * stageZoomScaleInverse}
              />
              <Text
                verticalAlign='middle'
                fontSize={14 * stageZoomScaleInverse}
                text={`${field.fieldName}: ${
                  field.fieldValue !== 0
                    ? parseFloat(field.fieldValue).toFixed(2)
                    : field.defaultValue
                }`}
                x={10 * stageZoomScaleInverse}
                y={10 * stageZoomScaleInverse}
                width={160 * stageZoomScaleInverse}
              />
            </Group>
          );
        })}
      </>
    );
  }
}
