// Importing tests into one process avoids child-process spawning, which is
// restricted in some deployment and sandbox environments.
import "./inquiries.test.js";
import "./seedTestimonials.test.js";
import "./testimonials.test.js";
import "./seo.test.js";
