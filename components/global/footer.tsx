import icon_white from "../../assets/global/icon_white.png";
import "../../styles/Pages/global/footer.css";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Image src={icon_white} alt="ICB Logo" className="footer-image" />
        </div>
        <div className="footer-text">
          &copy; {new Date().getFullYear()} ICB. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
