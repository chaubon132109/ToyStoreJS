// src/components/Footer.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faLinkedinIn,
  faPinterestP,
  faVimeoV,
} from "@fortawesome/free-brands-svg-icons";
import "../style/footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-top__contact">
          <div className="footer-top-infor">
            <div className="infor__title">Call Us</div>
            <div className="infor__text">
              <FontAwesomeIcon icon={faPhone} /> +84-966-805-861
            </div>
          </div>
          <div className="footer-top-infor">
            <div className="infor__title">Email</div>
            <div className="infor__text">
              <FontAwesomeIcon icon={faEnvelope} /> chausaker21@gmail.com
            </div>
          </div>
        </div>
        {/* Other footer sections */}
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom__content">
          © 2019 Travel Tour All Rights Reserved.
        </div>
        <div className="footer-bottom__follow">
          Follow Us
          <a href="#">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faPinterestP} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faVimeoV} />
          </a>
        </div>
      </div>
    </div>
  );
}
