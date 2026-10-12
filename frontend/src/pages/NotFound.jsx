import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => (
  <>
    <SEO title="Page Not Found" />
    <div className="section container-max py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl text-espresso mb-4">Page not found</h1>
      <p className="text-espresso/60 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  </>
);

export default NotFound;
