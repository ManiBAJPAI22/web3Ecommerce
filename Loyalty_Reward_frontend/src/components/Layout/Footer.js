import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <MDBFooter bgColor="dark" className="text-center text-lg-start text-white">
      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-5">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Style Fusion
              </h6>
              <p>
                Indulge in a world-class shopping experience at your fingertips.
                Explore exclusive collections, enjoy hassle-free returns, and
                find unbeatable deals, all delivered with unparalleled
                convenience
              </p>
            </MDBCol>
            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-5">
              <h6 className="text-uppercase fw-bold mb-4">Social networks</h6>
              <p>
                <a href="" className="me-4 text-reset">
                  <MDBIcon fab icon="facebook-f" />
                </a>
                <span className="text-white">Facebook</span>
              </p>
              <p>
                <a href="" className="me-4 text-reset">
                  <MDBIcon fab icon="twitter" />
                </a>
                <span className="text-white">Twitter</span>
              </p>
              <p>
                <a href="" className="me-4 text-reset">
                  <MDBIcon fab icon="google" />
                </a>
                <span className="text-white">Google</span>
              </p>
              <p>
                <a href="" className="me-4 text-reset">
                  <MDBIcon fab icon="instagram" />
                </a>
                <span className="text-white">Instagram</span>
              </p>
            </MDBCol>
            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-5">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <p>
                <a href="#!" className="text-reset text-white">
                  Electronics
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Home & Kitchen
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Clothing & Brands
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Books, Sports
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-5">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <p>
                <Link to="/terms" className="text-reset text-white">
                  Terms and Conditions
                </Link>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Settings
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Orders
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset text-white">
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-5">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                Delhi, India
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                stylefusion@gmail.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 91 123 731 22 33
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 91 123 726 22 33
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </MDBFooter>
  );
}

export default Footer;
