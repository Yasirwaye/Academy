import React from 'react';
import Navbar from '@/components/original/Navbar';
import Footer from '@/components/original/Footer';

const Terms = () => {
  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', color: 'white' }}>
      <Navbar activeSection="terms" scrollToSection={() => {}} />
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Terms of Service
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing or using the Eastleigh United FC website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
                <p className="text-gray-300 leading-relaxed">
                  Eastleigh United FC provides information about our football programs, player development, tryouts, matches, and related services. We offer:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-3">
                  <li>Player recruitment and application processing</li>
                  <li>Squad information and match schedules</li>
                  <li>Football training programs and coaching services</li>
                  <li>News and updates about club activities</li>
                  <li>Community engagement initiatives</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Player Applications</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When applying to join Eastleigh United FC programs:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>You must provide accurate, complete, and current information</li>
                  <li>For applicants under 18, parental consent is required</li>
                  <li>We reserve the right to accept or reject any application</li>
                  <li>Submission of false information may result in immediate disqualification</li>
                  <li>All players must comply with club rules and codes of conduct</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
                <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Use the website for any illegal purpose</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the website's functionality</li>
                  <li>Attempt to gain unauthorized access to any systems or networks</li>
                  <li>Post offensive, discriminatory, or inappropriate content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                <p className="text-gray-300 leading-relaxed">
                  All content on this website, including logos, graphics, images, text, and software, is the property of Eastleigh United FC or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Medical and Physical Requirements</h2>
                <p className="text-gray-300 leading-relaxed">
                  Participation in football activities carries inherent risks of injury. By applying to our programs:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-3">
                  <li>You acknowledge that football is a physically demanding sport</li>
                  <li>You confirm you are physically capable of participating</li>
                  <li>You agree to provide accurate medical information</li>
                  <li>Parents/guardians assume responsibility for their child's participation</li>
                  <li>We recommend a medical examination before participation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed">
                  To the maximum extent permitted by law, Eastleigh United FC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our website or participation in our programs. We are not responsible for injuries sustained during training, matches, or club activities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Parental Consent</h2>
                <p className="text-gray-300 leading-relaxed">
                  For participants under 18 years of age, a parent or legal guardian must provide explicit consent for:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-3">
                  <li>Collection of personal information</li>
                  <li>Participation in club activities</li>
                  <li>Photography/videography during events</li>
                  <li>Emergency medical treatment</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Photography and Media</h2>
                <p className="text-gray-300 leading-relaxed">
                  Eastleigh United FC may take photographs and videos during training sessions, matches, and events. By participating, you grant us permission to use these images for promotional purposes, including social media, website, and marketing materials, unless you explicitly opt-out in writing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Fees and Payments</h2>
                <p className="text-gray-300 leading-relaxed">
                  Some programs may require registration fees. All fees are:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-3">
                  <li>Clearly communicated before payment</li>
                  <li>Non-refundable unless otherwise stated</li>
                  <li>Subject to change with reasonable notice</li>
                  <li>Payable through approved payment methods</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to terminate or suspend access to our services immediately, without prior notice, for conduct that violates these Terms of Service or is harmful to other users, players, or the club's reputation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may modify these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the modified terms. Please review these terms periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising from these terms shall be resolved in the courts of Nairobi, Kenya.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="text-gray-200">📧 <strong>Email:</strong> eastleigh_unitedfc.com</p>
                  <p className="text-gray-200 mt-2">📞 <strong>Phone:</strong> +254 722 218 608</p>
                  <p className="text-gray-200 mt-2">📍 <strong>Address:</strong> Nairobi, Eastleigh, Kenya</p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-cyan-300 font-semibold">
                  By using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;