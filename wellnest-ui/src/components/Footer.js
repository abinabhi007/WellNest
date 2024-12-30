import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="text-dark py-5" style={{background:'#ebffdb',lineHeight:'30px'}}>
      <div className="container">
        <div className="row">
          {/* Column 1: DentalPro */}
          <div className="col-md-4 mb-4">
            <h5>WellNest</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum ipsum eius temporibus est. Quia autem dolor, animi cum laborum similique accusamus molestiae,
            </p>
            
          </div>

          {/* Column 2: Treatments */}
          <div className="col-md-2 mb-4" style={{lineHeight:'30px'}}>
            <h5>Treatments</h5>
            <ul className="list-unstyled">
              <li>General Treatment</li>
              <li>Dental Care</li>
              <li>Heart Surgery</li>
              <li>Eye Care</li>
              <li>Blood Transfusion</li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="col-md-3 mb-4" style={{lineHeight:'30px'}}>
            <h5>Contact Details</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-geo-alt-fill"></i> Sreekaryam, Trivandrum
              </li>
              <li>
                <i className="bi bi-clock-fill"></i> Mon - Fri: 9:00 - 19:00
                <br />
                Closed on Weekends
              </li>
              <li>
                <i className="bi bi-telephone-fill"></i> +91 7878981293
              </li>
              <li>
                <i className="bi bi-envelope-fill"></i> mashupstack@gmail.com
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links */}
          <div className="col-md-3">
            <h5>We're Social</h5>
            <div className="d-flex gap-3 mt-3">
              <i className="bi bi-facebook fs-4"></i>
              <i className="bi bi-twitter fs-4"></i>
              <i className="bi bi-instagram fs-4"></i>
            </div>
            <p className="mt-4 mb-0" style={{fontSize:'14px'}}>&copy; 2024 ABIN_HN. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
