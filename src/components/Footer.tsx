import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Payments</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">Cancellation</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Policy</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
            <li><a href="#" className="hover:text-white">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Social</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Facebook</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">YouTube</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Mail Us</h3>
          <p className="text-sm text-gray-400">
            Flipkart Clone Pvt Ltd,<br />
            123 React Street,<br />
            Bengaluru, India
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Flipkart Clone. All rights reserved.
      </div>
    </footer>
  );
}
