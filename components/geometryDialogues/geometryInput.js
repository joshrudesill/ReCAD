import { Rect, Text, Group } from "react-konva";
import { useSelector } from "react-redux";

export default function GeometryInput({ inputRefFocus, setMouseInstruction }) {
  const stageOffset = useSelector((state) => state.drawingControl.stageOffset);
  const stageZoomScaleInverse = useSelector(
    (state) => state.drawingControl.stageZoomScaleInverse
  );
  const { showGeometryInput, geometryInputDataFields } = useSelector(
    (state) => state.UIControl
  );
  const handleClick = (fieldName) => {
    console.log("clicked");
    var focusType = "";
    switch (fieldName) {
      case "StartingX":
        focusType = "sx";
        break;
      case "StartingY":
        focusType = "sy";
        break;
      case "Length":
        focusType = "length";
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
            >
              <Rect
                height={40 * stageZoomScaleInverse}
                width={
                  geometryInputDataFields.length * 100 * stageZoomScaleInverse
                }
                fill='teal'
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
                onClick={() => handleClick(field.fieldName)}
              />
            </Group>
          );
        })}
      </>
    );
  }
}
