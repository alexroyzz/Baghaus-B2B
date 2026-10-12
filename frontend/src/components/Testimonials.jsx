import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

const TestimonialCard = ({ testimonial }) => (
  <article className="testimonial-card" role="listitem">
    <span className="testimonial-quote" aria-hidden="true">“</span>
    <div className="testimonial-card-heading">
      <span className="testimonial-avatar" aria-hidden="true">
        {testimonial.photo?.url ? <img src={getImageUrl(testimonial.photo, { width: 128, height: 128 })} alt="" width="68" height="68" loading="lazy" decoding="async" className="h-full w-full rounded-full object-cover" /> : testimonial.customerName.charAt(0)}
      </span>
      <div className="testimonial-customer">
        <h3>{testimonial.customerName}</h3>
        <div className="testimonial-stars" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }, (_, index) => <FaStar key={index} aria-hidden="true" />)}
        </div>
      </div>
    </div>
    <span className="testimonial-divider" aria-hidden="true" />
    <p className="testimonial-review">{testimonial.reviewText}</p>
  </article>
);

const Testimonials = () => {
  const dragRef = useRef(null);
  const viewportRef = useRef(null);
  const firstGroupRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loop, setLoop] = useState({ groupCount: 2, distance: null, duration: 42_000 });

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
    return () => { active = false; window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  useLayoutEffect(() => {
    if (!testimonials.length) return undefined;
    const viewport = viewportRef.current;
    const group = firstGroupRef.current;
    if (!viewport || !group) return undefined;

    const measure = () => {
      const groupWidth = group.getBoundingClientRect().width;
      const viewportWidth = viewport.clientWidth;
      if (!groupWidth || !viewportWidth) return;
      // Keep enough identical groups after the one-group animation travel to
      // cover the entire viewport, even with just one or two published reviews.
      const groupCount = Math.max(2, Math.ceil(viewportWidth / groupWidth) + 1);
      const duration = Math.max(18_000, Math.round((groupWidth / 44) * 1000));
      setLoop((current) => current.distance === groupWidth && current.groupCount === groupCount && current.duration === duration
        ? current
        : { groupCount, distance: groupWidth, duration });
    };

    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(viewport);
      observer.observe(group);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [testimonials]);

  const handlePointerDown = (event) => {
    if (event.pointerType !== "touch") return;
    const track = event.currentTarget.querySelector(".testimonial-track");
    const animation = track?.getAnimations()[0];
    const groupWidth = firstGroupRef.current?.getBoundingClientRect().width || 0;
    if (!animation || !groupWidth) return;

    animation.pause();
    dragRef.current = {
      animation,
      startX: event.clientX,
      startTime: Number(animation.currentTime) || 0,
      groupWidth,
      duration: Number(animation.effect?.getTiming().duration) || loop.duration,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || event.pointerType !== "touch") return;
    const { animation, startX, startTime, groupWidth, duration } = dragRef.current;
    const offset = -(((event.clientX - startX) * duration) / groupWidth);
    animation.currentTime = ((startTime + offset) % duration + duration) % duration;
  };

  const resumeMarquee = () => {
    dragRef.current?.animation.play();
    dragRef.current = null;
  };

  if (!loading && !testimonials.length && !loadError) return null;

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="testimonials-heading">
        <p className="testimonials-eyebrow"><span />Testimonials<span /></p>
        <h2 id="testimonials-title">What Our <span className="testimonials-title-accent">Customers</span> Say</h2>
        <p className="testimonials-subtitle">Quality craftsmanship and customer satisfaction you can trust.</p>
      </div>

      {loading ? (
        <div className="testimonials-status" role="status" aria-live="polite" aria-busy="true">Loading customer reviews…</div>
      ) : loadError && !testimonials.length ? (
        <div className="testimonials-status" role="status">Customer reviews are temporarily unavailable.</div>
      ) : (
        <div
          ref={viewportRef}
          className="testimonials-viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={resumeMarquee}
          onPointerCancel={resumeMarquee}
        >
          <div
            className="testimonial-track"
            style={loop.distance ? {
              "--testimonial-distance": `-${loop.distance}px`,
              "--testimonial-duration": `${loop.duration}ms`,
            } : { animationPlayState: "paused" }}
          >
            {Array.from({ length: loop.groupCount }, (_, groupIndex) => (
              <div
                ref={groupIndex === 0 ? firstGroupRef : undefined}
                key={`testimonial-group-${groupIndex}`}
                className="testimonial-group"
                role="list"
                aria-label={groupIndex === 0 ? "Customer testimonials" : undefined}
                aria-hidden={groupIndex === 0 ? undefined : "true"}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={`${groupIndex}-${testimonial._id}`} testimonial={testimonial} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
