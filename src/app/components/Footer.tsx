import imgInstagram from "../../assets/485cdfbb4ee33ad9e8edaa9f3508b727fd20f46b.png";
import imgYoutube from "../../assets/79b69231d1b1377ddefd963be02897a498b81cc3.png";
import imgLinkedin from "../../assets/efa7a2c2d2b7a716f793a3b251108e7439342963.png";
import imgFacebook from "../../assets/f3ec45e63fff1ba1a6e0f721c0a8b269cca5c099.png";
import imgTwitter from "../../assets/fc1e243d42adae1dce02bc51bf93aa48854c8014.png";
import imgVisa from "../../assets/988848f0186f93528c07424eef09c0f17601f4cf.png";
import Image from 'next/image';

interface FooterProps {
  onPrivacyPolicyClick?: () => void;
  onTermsClick?: () => void;
}

export default function Footer({ onPrivacyPolicyClick, onTermsClick }: FooterProps = {}) {
  const footerLinks = {
    'Shop': ['Dental Equipment', 'Instruments', 'Consumables', 'Furniture', 'New Arrivals'],
    'Support': ['Contact Us', 'FAQs', 'Shipping Info', 'Returns', 'Track Order'],
    'Company': ['About Us', 'Careers', 'Blog', 'Press', 'Partners'],
    'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'],
  };

  const socialLinks = [
    { name: 'Instagram', image: imgInstagram },
    { name: 'YouTube', image: imgYoutube },
    { name: 'LinkedIn', image: imgLinkedin },
    { name: 'Facebook', image: imgFacebook },
    { name: 'Twitter', image: imgTwitter },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    {link === 'Privacy Policy' && onPrivacyPolicyClick ? (
                      <button 
                        onClick={onPrivacyPolicyClick}
                        className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
                      >
                        {link}
                      </button>
                    ) : link === 'Terms of Service' && onTermsClick ? (
                      <button 
                        onClick={onTermsClick}
                        className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
                      >
                        {link}
                      </button>
                    ) : (
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-3">Subscribe to our newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates on new products and upcoming sales</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-600 text-white"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Payment */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Social Media */}
            <div>
              <p className="text-sm text-gray-400 mb-3 text-center sm:text-left">Follow us</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-8 h-8 hover:opacity-80 transition-opacity"
                    aria-label={social.name}
                  >
                    <Image src={social.image} alt={social.name} className="w-full h-full" />
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-sm text-gray-400 mb-3 text-center sm:text-right">We accept</p>
              <div className="flex gap-3">
                <Image src={imgVisa} alt="Visa" className="h-8" />
                <div className="h-8 px-4 bg-white rounded flex items-center">
                  <span className="text-blue-600 font-semibold text-sm">Mastercard</span>
                </div>
                <div className="h-8 px-4 bg-white rounded flex items-center">
                  <span className="text-blue-600 font-semibold text-sm">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Dental Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}