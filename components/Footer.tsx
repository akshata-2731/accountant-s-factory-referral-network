
import React from 'react';
import Button from './Button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-gray text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Earning?</h2>
            <p className="max-w-2xl mx-auto text-gray-300 mb-6">Join our network of partners and turn your connections into a valuable revenue stream.</p>
            <Button variant="primary">Join the Referral Network</Button>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Accountant's Factory. All rights reserved.</p>
          <div className="flex items-center justify-center mt-4 md:mt-0 space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="font-semibold text-lg">91766 71206</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
