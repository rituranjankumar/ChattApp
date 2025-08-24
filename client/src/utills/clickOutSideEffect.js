import { useEffect } from "react";

export const clickOutSideEfffect=(ref,callback)=>
{
     useEffect(() => {
    // Define the listener function to be called on click/touch events
    const listener = (event) => {
      // If the click/touch event originated inside the ref element, do nothing
    //  console.log("useref console -> ",ref.current);
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the provided handler function
      callback();
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]); // Only run this effect when the ref or handler function changes
}