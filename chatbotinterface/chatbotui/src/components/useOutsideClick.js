import { useEffect } from 'react';

// Custom hook that takes a ref to the element and the visibility state
const useOutsideClick = (ref, isVisible, setIsVisible) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && ref.current && !ref.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, isVisible, setIsVisible]); // Only re-run if ref or isVisible changes
};

export default useOutsideClick;
