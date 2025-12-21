import { useEffect, useRef } from "react";
import styles from "./CardSlide.module.css";

const CardSlide = ({
  children,
  direction = "left",
  delay = 0,
  duration = 1.0,
  distance = 80
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.active);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass =
    direction === "right" ? styles.fromRight : styles.fromLeft;

  return (
    <div
      ref={ref}
      className={`${styles.card} ${dirClass}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
        "--slide-distance": `${distance}px`
      }}
    >
      {children}
    </div>
  );
};

export default CardSlide;
