import React from 'react';
import Navbar from '@/components/original/Navbar';
import Footer from '@/components/original/Footer';

const Privacy = () => {
  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', color: 'white' }}>
      <Navbar activeSection="privacy" scrollToSection={() => {}} />
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Privacy Policy
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-300 leading-relaxed">
                  Eastleigh United FC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <p className="text-gray-300 leading-relaxed mb-4">We may collect information about you in a variety of ways, including:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li><strong className="text-white">Personal Data:</strong> Name, email address, phone number, age, playing position, and other similar information you provide when applying to join our programs or contacting us.</li>
                  <li><strong className="text-white">Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and pages viewed.</li>
                  <li><strong className="text-white">Cookies:</strong> We may use cookies and similar tracking technologies to track activity on our website and hold certain information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Process and evaluate player applications for our programs</li>
                  <li>Communicate with you about tryouts, matches, and club events</li>
                  <li>Send you newsletters, updates, and promotional materials (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Disclosure of Your Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may share information we have collected about you in certain situations. Your information may be disclosed to coaches, staff members, and affiliated organizations as necessary for club operations. We do not sell, trade, or rent your personal information to third parties for marketing purposes without your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Children's Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our programs are designed for players of various ages. For participants under 18, we require parental consent before collecting any personal information. Parents or guardians may review, update, or delete their child's information by contacting us directly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                <p className="text-gray-300 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may use third-party services such as analytics providers, payment processors, or social media platforms. These third parties have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Cookies Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can set your browser to refuse all or some browser cookies, but this may affect website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy frequently.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="text-gray-200">📧 <strong>Email:</strong> eastleigh_unitedfc.com</p>
                  <p className="text-gray-200 mt-2">📞 <strong>Phone:</strong> +254 722 218 608</p>
                  <p className="text-gray-200 mt-2">📍 <strong>Address:</strong> Nairobi, Eastleigh, Kenya</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;