"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollFloat.module.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    if (typeof children !== "string") return null;

    return children.split("").map((char, index) => (
      <span className={styles.char} key={index}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scroller =
      scrollContainerRef?.current || window;

    const chars = containerRef.current.querySelectorAll(
      `.${styles.char}`
    );

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%"
      },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        duration: animationDuration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2
      ref={containerRef}
      className={`${styles.scrollFloat} ${containerClassName}`}
    >
      <span
        className={`${styles.scrollFloatText} ${textClassName}`}
      >
        {splitText}
      </span>
    </h2>
  );
};

export default ScrollFloat;
