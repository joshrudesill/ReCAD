import { Rect, Text } from "react-konva";
import { useSelector } from "react-redux";

export default function GeometryInput() {
  const stageOffset = useSelector((state) => state.drawingControl.stageOffset);
  const stageZoomScaleInverse = useSelector(
    (state) => state.drawingControl.stageZoomScaleInverse
  );
  const { showGeometryInput, geometryInputDataFields } = useSelector(
    (state) => state.UIControl
  );

  if (showGeometryInput) {
    return (
      <>
        <Rect
          height={50 * stageZoomScaleInverse}
          width={700 * stageZoomScaleInverse}
          fill='teal'
          x={(stageOffset.x + 10) * stageZoomScaleInverse}
          y={(stageOffset.y + 10) * stageZoomScaleInverse}
          cornerRadius={10 * stageZoomScaleInverse}
        />
        {geometryInputDataFields.map((field, i) => {
          return (
            <Text
              text={`${field.fieldName}: ${
                field.fieldValue || field.defaultValue
              }`}
              x={(stageOffset.x + 15 * (i + 1)) * stageZoomScaleInverse}
              y={(stageOffset.y + 15 * (i + 1)) * stageZoomScaleInverse}
            />
          );
        })}
      </>
    );
  }
}
