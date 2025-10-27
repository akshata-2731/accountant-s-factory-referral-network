import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../components/Button';
import Card from '../components/Card';
import { SERVICES, FAQS, TESTIMONIALS } from '../constants';
import type { FAQ, Testimonial, User } from '../types';
import { ChevronDownIcon } from '../components/icons';
import { loginWithGoogle } from '../services/mockApiService';

interface LandingPageProps {
  onGoogleLogin: (user: User) => void;
  authMessage: string;
}

const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-brand-gray"
      >
        <span>{faq.question}</span>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <p className="mt-2 text-gray-600 pr-6">{faq.answer}</p>}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGoogleLogin, authMessage }) => {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      alert('Google login failed: Missing credential');
      return;
    }
    try {
      const user = await loginWithGoogle(idToken);
      onGoogleLogin(user);
    } catch (error: any) {
      alert('Login failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleGoogleError = () => {
    alert('Google sign-in failed. Please try again.');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="hero" className="bg-brand-light-gray py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-brand-gray leading-tight">
            Turn Your Network into Net Worth
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Join the Accountant's Factory Referral Network. Refer clients for premier financial services and earn exclusive commissions. It's simple, transparent, and rewarding.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="pill"
              theme="outline"
            />
            {authMessage && (
              <div className="mt-4 text-center max-w-md text-orange-800 bg-orange-100 p-4 rounded-lg border border-orange-200">
                <p>{authMessage}</p>
              </div>
            )}
            <button
              onClick={() => onGoogleLogin({ role: 'admin' } as User)}
              className="text-sm text-gray-500 hover:underline pt-2"
            >
              Admin Login
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-gray">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-gray-600">A seamless process from referral to reward.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-teal text-white mx-auto text-2xl font-bold">1</div>
              <h3 className="mt-6 text-xl font-semibold text-brand-gray">Submit a Referral</h3>
              <p className="mt-2 text-gray-600">Use our simple form to refer a client in need of our expert financial services.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-teal text-white mx-auto text-2xl font-bold">2</div>
              <h3 className="mt-6 text-xl font-semibold text-brand-gray">We Handle the Rest</h3>
              <p className="mt-2 text-gray-600">Our team engages the client, provides proposals, and delivers top-tier service.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-teal text-white mx-auto text-2xl font-bold">3</div>
              <h3 className="mt-6 text-xl font-semibold text-brand-gray">Get Rewarded</h3>
              <p className="mt-2 text-gray-600">Once the client pays, your commission is credited to your wallet. It's that easy!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-gray">Key Services for referral</h2>
            <p className="mt-4 text-gray-600">A wide range of high-demand financial and business services.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.slice(0, 4).map(service => (
              <Card key={service.id} className="text-center">
                <service.icon className="w-12 h-12 mx-auto text-brand-teal" />
                <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm text-gray-500 font-medium text-brand-teal-dark">{service.commission}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mid Page CTA */}
      <section className="bg-brand-teal text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold">Be the Link Between Growth & Compliance</h2>
          <p className="mt-4 max-w-2xl mx-auto">Help businesses thrive by connecting them with the financial expertise they need.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-gray">Trusted by Professionals</h2>
            <p className="mt-4 text-gray-600">Here what our partners and clients have to say.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(testimonial => (
              <Card key={testimonial.id} className="flex flex-col">
                <p className="text-gray-600 flex-grow">"{testimonial.quote}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-brand-gray">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-gray">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {FAQS.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
