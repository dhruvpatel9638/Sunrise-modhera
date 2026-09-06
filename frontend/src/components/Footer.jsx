import React from 'react';
import { ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bg-text">Sunrise</div>
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 - About */}
          <div className="footer-col footer-about">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img src={logo} alt="Modhera Sunrise Logo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
              <h3 style={{ fontFamily: 'var(--font-headings)', color: '#FFFFFF', fontSize: '1.4rem' }}>
                Modhera Sunrise
              </h3>
            </div>
            <p>
              A rustic-yet-modern eco-resort blending heritage rural life with leisure comfort. Nestled directly on the banks of the Pushpavati River behind the world-famous UNESCO Modhera Sun Temple.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>100% Pure Vegetarian & Eco-Safe</span>
            </div>
          </div>

          {/* Col 2 - Quick links */}
          <div className="footer-col footer-links">
            <h4>Resort Navigation</h4>
            <ul>
              <li><a href="#accommodations">Accommodations</a></li>
              <li><a href="#amenities">Resort Amenities</a></li>
              <li><a href="#dining">Jungle Restaurant</a></li>
              <li><a href="#gallery">Media Gallery</a></li>
              <li><a href="#admin" style={{ fontWeight: '600', color: 'var(--color-gold)' }}>Admin Portal</a></li>
            </ul>
          </div>

          {/* Col 3 - Explore */}
          <div className="footer-col footer-links">
            <h4>Explore Nearby</h4>
            <ul>
              <li><a href="https://maps.google.com/?q=Modhera+Sun+Temple" target="_blank" rel="noopener noreferrer">UNESCO Sun Temple</a></li>
              <li><a href="https://maps.app.goo.gl/B7NDjBSFRYCbZZe69" target="_blank" rel="noopener noreferrer">Modheshwari Temple</a></li>
              <li><a href="https://maps.app.goo.gl/4S4ubH23fJgVM9v38" target="_blank" rel="noopener noreferrer">Bahucharaji Temple</a></li>
              <li><a href="https://maps.app.goo.gl/CkRze4gkN3u8L8ek7" target="_blank" rel="noopener noreferrer">Patan (Rani Ki Vav)</a></li>
            </ul>
          </div>

          {/* Col 4 - Details */}
          <div className="footer-col footer-about">
            <h4>Get In Touch</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Behind Modhera Sun Temple,<br />
              Becharaji-Mehsana Road, Gujarat, India.
            </p>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              <strong>Phone:</strong> +91 98765 43210<br />
              <strong>Email:</strong> stay@modherasunriseresort.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            © {new Date().getFullYear()} Modhera Sunrise Resort.
          </div>
          <div className="footer-bottom-center">
            All Rights Reserved.
          </div>
          <div className="footer-bottom-right">
            Designed with nature therapy & heritage protection in mind.
          </div>
        </div>
      </div>
    </footer>
  );
}
