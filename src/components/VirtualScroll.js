import React, { useEffect, useState } from "react";

const VirtualScroll = (props) => {
    const { rowHeight, nodePadding, children } = props;

    const [viewportHeight, setViewportHeight] = useState(0);


    useEffect(() => {

        console.log(window.visualViewport.height)

    }, []);

    return <div>{children}</div>
}

export default VirtualScroll;