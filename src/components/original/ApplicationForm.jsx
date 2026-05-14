import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { db } from '@/api/dataService';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', position: '',
    previousClub: '', email: '', phone: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return 'First and last name are required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'A valid email address is required.';
    if (!formData.dob) return 'Date of birth is required.';
    if (!formData.position) return 'Please select a preferred position.';
    if (formData.phone && !/^[+\d\s\-()]{7,20}$/.test(formData.phone)) return 'Phone number format is invalid.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError(null);
    try {
      await db.Application.create({
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dob,
        position: formData.position,
        previous_club: formData.previousClub,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'pending',
      });
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', dob: '', position: '', previousClub: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-display gradient-text mb-4">Apply to Join Eastleigh FC</h2>
          <p className="text-gray-400">Take the first step towards your professional football career</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-gray-400">Our scouting team will review your application and contact you within 5 working days.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-cyan-400 hover:text-cyan-300 underline">
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'First Name *', name: 'firstName', type: 'text', required: true },
                  { label: 'Last Name *', name: 'lastName', type: 'text', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      required={f.required}
                      className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                  <input
                    type="date" name="dob" value={formData.dob} onChange={handleChange} required
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Position *</label>
                  <select
                    name="position" value={formData.position} onChange={handleChange} required
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="">Select Position</option>
                    <option value="GK">Goalkeeper</option>
                    <option value="DEF">Defender</option>
                    <option value="MID">Midfielder</option>
                    <option value="FWD">Forward</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Club (if any)</label>
                <input
                  type="text" name="previousClub" value={formData.previousClub} onChange={handleChange}
                  className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join Eastleigh FC Academy?</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange} rows={4}
                  className="w-full rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 text-white resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;