// import { useEffect, useMemo, useRef } from "react";
// import styles from "./ScrollFloat.module.css";

// const ScrollFloat = ({
//   children,
//   scrollContainerRef,
//   containerClassName = "",
//   textClassName = "",
//   animationDuration = 1,
//   ease = "back.inOut(2)",
//   scrollStart = "center bottom+=50%",
//   scrollEnd = "bottom bottom-=40%",
//   stagger = 0.03,
// }) => {
//   const containerRef = useRef(null);

//   const splitText = useMemo(() => {
//     if (typeof children !== "string") return null;

//     return children.split("").map((char, index) => (
//       <span className={styles.char} key={index}>
//         {char === " " ? "\u00A0" : char}
//       </span>
//     ));
//   }, [children]);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     let ctx;

//     (async () => {
//       const gsapModule = await import("gsap");
//       const scrollTriggerModule = await import("gsap/ScrollTrigger");

//       const gsap = gsapModule.gsap || gsapModule.default;
//       const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

//       gsap.registerPlugin(ScrollTrigger);

//       const scroller =
//         scrollContainerRef?.current || window;

//       const chars = containerRef.current.querySelectorAll(
//         `.${styles.char}`
//       );

//       ctx = gsap.context(() => {
//         gsap.fromTo(
//           chars,
//           {
//             opacity: 0,
//             yPercent: 120,
//             scaleY: 2.3,
//             scaleX: 0.7,
//             transformOrigin: "50% 0%",
//           },
//           {
//             opacity: 1,
//             yPercent: 0,
//             scaleY: 1,
//             scaleX: 1,
//             duration: animationDuration,
//             ease,
//             stagger,
//             scrollTrigger: {
//               trigger: containerRef.current,
//               scroller,
//               start: scrollStart,
//               end: scrollEnd,
//               scrub: true,
//             },
//           }
//         );
//       });
//     })();

//     return () => ctx && ctx.revert();
//   }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

//   return (
//     <h2
//       ref={containerRef}
//       className={`${styles.scrollFloat} ${containerClassName}`}
//     >
//       <span className={`${styles.scrollFloatText} ${textClassName}`}>
//         {splitText}
//       </span>
//     </h2>
//   );
// };

// export default ScrollFloat;
