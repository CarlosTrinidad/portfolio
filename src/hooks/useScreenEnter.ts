import React from "react"

function isInViewPort(rect:any) {
  if (
    window.screen.height >= rect.bottom &&
    window.screen.width >= rect.right &&
    rect.top >= 0 &&
    rect.left >= 0
  )
    return true;
  return false;
}
const useScreenEnter = (ref:any, callback:Function) => {
  const [entered, setEntered] = React.useState(false);

  function activate() {
    if (
      ref.current &&
      isInViewPort(ref.current.getBoundingClientRect()) &&
      !entered
    ) {
      callback();
      setEntered(true);
    }
  }

  React.useEffect(() => {
    document.addEventListener("DOMContentLoaded", activate);
    document.addEventListener("mouseenter", activate);
    document.addEventListener("touchstart", activate);
    return () => {
        document.removeEventListener("DOMContentLoaded", activate);
        document.removeEventListener("mouseenter", activate);
        document.removeEventListener("touchstart", activate);
    };
  });
}

export default useScreenEnter