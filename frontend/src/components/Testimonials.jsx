import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

const TestimonialCard = ({ testimonial }) => (
  <article className="testimonial-card">
    <div className="testimonial-card-heading">
      <span className="testimonial-avatar" aria-hidden="true">
        {testimonial.photo?.url ? (
          <img
            src={getImageUrl(testimonial.photo, { width: 128, height: 128 })}
            alt=""
            width="68"
            height="68"
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-full object-cover"
          />
        ) : testimonial.customerName.charAt(0)}
      </span>
      <div className="testimonial-customer">
        <h3>{testimonial.customerName}</h3>
        <div className="testimonial-stars" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }, (_, index) => (
            <FaStar key={index} aria-hidden="true" />
          ))}
        </div>
      </div>
    </div>
    <span className="testimonial-divider" aria-hidden="true" />
    <p className="testimonial-review">{testimonial.reviewText}</p>
  </article>
);

const Testimonials = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cycleRef = useRef(null);
  const cardRef = useRef(null);
  const offsetRef = useRef(0);
  const copiesRef = useRef(1);
  const hoveredRef = useRef(false);
  const dragRef = useRef(null);
  const manualAnimationRef = useRef(null);
  const resumeAtRef = useRef(0);
  const [testimonials, setTestimonials] = useState([]);
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    let hasLoaded = false;
    const refresh = () => api.get("/testimonials").then((res) => {
      if (active) {
        const nextTestimonials = Array.isArray(res.data.data) ? res.data.data : [];
        setTestimonials((current) => JSON.stringify(current) === JSON.stringify(nextTestimonials) ? current : nextTestimonials);
        setLoadError(false);
      }
    }).catch(() => {
      if (active && !hasLoaded) setLoadError(true);
    }).finally(() => {
      hasLoaded = true;
      if (active) setLoading(false);
    });
    refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 30_000);
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const cycle = cycleRef.current;
    if (!viewport || !cycle || !testimonials.length) return undefined;

    const measure = () => {
      const baseCycleWidth = cycle.offsetWidth / copiesRef.current;
      if (!baseCycleWidth) return;
      const nextCopies = Math.max(1, Math.ceil((viewport.clientWidth + 24) / baseCycleWidth));
      if (nextCopies !== copiesRef.current) {
        copiesRef.current = nextCopies;
        setCopies(nextCopies);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(cycle);
    return () => observer.disconnect();
  }, [testimonials, copies]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !testimonials.length) return undefined;

    let frameId;
    let previousTime;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderOffset = (offset) => {
      const cycleWidth = cycleRef.current?.offsetWidth ?? 0;
      if (!cycleWidth) return;
      offsetRef.current = ((offset % cycleWidth) + cycleWidth) % cycleWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    const animate = (time) => {
      if (previousTime === undefined) previousTime = time;
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;

      const manualAnimation = manualAnimationRef.current;
      if (manualAnimation) {
        const progress = Math.min(1, (time - manualAnimation.startedAt) / 350);
        const easedProgress = 1 - (1 - progress) ** 3;
        renderOffset(manualAnimation.from + manualAnimation.distance * easedProgress);
        if (progress === 1) {
          manualAnimationRef.current = null;
          resumeAtRef.current = time + 1200;
        }
      } else if (!reducedMotion && !hoveredRef.current && !dragRef.current && time >= resumeAtRef.current) {
        renderOffset(offsetRef.current + elapsed * 0.024);
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [testimonials.length, copies]);

  if (!loading && !testimonials.length && !loadError) return null;

  const scrollReviews = (direction) => {
    const card = cardRef.current;
    const cycle = cycleRef.current;
    if (!card || !cycle) return;
    const gap = Number.parseFloat(window.getComputedStyle(card.parentElement).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    manualAnimationRef.current = {
      from: offsetRef.current,
      distance: direction * step,
      startedAt: performance.now(),
    };
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startOffset: offsetRef.current };
    manualAnimationRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.abs(event.clientX - drag.startX) > 4) event.preventDefault();
    const cycleWidth = cycleRef.current?.offsetWidth ?? 0;
    if (!cycleWidth) return;
    const offset = drag.startOffset - (event.clientX - drag.startX);
    offsetRef.current = ((offset % cycleWidth) + cycleWidth) % cycleWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    resumeAtRef.current = performance.now() + 1200;
  };

  return (
    <section
      className="testimonials-section"
      aria-labelledby="testimonials-title"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoveredRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hoveredRef.current = false;
      }}
      onFocus={() => {
        if (window.matchMedia("(hover: hover)").matches) hoveredRef.current = true;
      }}
      onBlur={(event) => {
        if (
          window.matchMedia("(hover: hover)").matches
          && !event.currentTarget.contains(event.relatedTarget)
        ) hoveredRef.current = false;
      }}
    >
      <div className="testimonials-heading">
        <div className="section-heading">
          <p className="testimonials-eyebrow"><span />Testimonials<span /></p>
          <h2 id="testimonials-title">
            What Our <span className="testimonials-title-accent">Customers</span> Say
          </h2>
          <p className="testimonials-subtitle">Feedback from businesses we work with.</p>
        </div>
        {!loading && testimonials.length > 1 && (
          <div className="testimonials-controls" aria-label="Testimonial controls">
            <button type="button" onClick={() => scrollReviews(-1)} aria-label="Previous testimonials" aria-controls="testimonials-carousel">
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollReviews(1)} aria-label="Next testimonials" aria-controls="testimonials-carousel">
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="testimonials-status" role="status" aria-live="polite" aria-busy="true">
          Loading customer reviews…
        </div>
      ) : loadError && !testimonials.length ? (
        <div className="testimonials-status" role="status">
          Customer reviews are temporarily unavailable.
        </div>
      ) : (
        <div
          ref={viewportRef}
          className="testimonials-viewport"
          id="testimonials-carousel"
          aria-label="Customer testimonials"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="testimonials-track" ref={trackRef}>
            {[0, 1].map((setIndex) => (
              <div
                className="testimonials-cycle"
                key={setIndex}
                ref={setIndex === 0 ? cycleRef : null}
                role={setIndex === 0 ? "list" : undefined}
                aria-hidden={setIndex === 1 ? "true" : undefined}
              >
                {Array.from({ length: copies * testimonials.length }, (_, itemIndex) => {
                  const testimonial = testimonials[itemIndex % testimonials.length];
                  return (
                    <div
                      className="testimonial-item"
                      key={`${testimonial._id}-${itemIndex}`}
                      ref={setIndex === 0 && itemIndex === 0 ? cardRef : null}
                      role={setIndex === 0 ? "listitem" : undefined}
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
