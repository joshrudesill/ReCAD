import { useSelector } from "react-redux";

export default function UserInstruction() {
  const instructions = {
    "": {
      "": {
        "": "",
      },
    },
    drawing: {
      line: {
        start: "Pick a starting point",
        during:
          "Click an endpoint or type a length. Hold SHIFT to lock at 90 degree intervals",
        issue: "Issue creating line",
      },
    },
    augmentation: {},
  };
  const { category, command, stage } = useSelector(
    (state) => state.UIControl.currentInstruction
  );
  // Gross looking ECMAScript, but does the trick
  return <>{instructions?.[category]?.[command]?.[stage] ?? "Not Found"}</>;
}
