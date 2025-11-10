import { Link } from "react-router-dom";
import "../css/Navbar.css"

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Cinema</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/favourites" className="navbar-link">Favourites</Link>
      </div>
    </nav>
  );
}

export default NavBar;
