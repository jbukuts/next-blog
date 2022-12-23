import React, { useState } from "react";

const CopyButton = () => {
  // eslint-disable-next-line no-unused-vars
  const [clicked, setClicked] = useState(false);

  return (
    <button type="button" onClick={() => setClicked(true)}>
      {clicked ? "one" : "two"}
    </button>
  );
};

export default CopyButton;
