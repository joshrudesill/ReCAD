import dynamic from "next/dynamic";
import React from "react";
const NoSSRWrapper = (props) => <>{props.children}</>;
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
