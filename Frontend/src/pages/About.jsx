import React from 'react';
import Navbar from '../components/components_lite/Navbar';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">About DreamHire</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                We're dedicated to connecting talented professionals with meaningful career opportunities. 
                Our platform makes job searching simple, efficient, and effective for both candidates and recruiters.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">For Job Seekers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Easy-to-use interface for job applications</li>
                    <li>• Direct communication with recruiters</li>
                    <li>• Track your application status in real-time</li>
                    <li>• Build and manage your professional profile</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">For Recruiters</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Post job openings to reach qualified candidates</li>
                    <li>• Review applications and resumes efficiently</li>
                    <li>• Manage hiring process all in one place</li>
                    <li>• Access a growing talent pool</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us</h2>
              <div className="space-y-3 text-gray-600">
                <p>• <strong>Simplicity:</strong> Clean, intuitive design that's easy to navigate</p>
                <p>• <strong>Efficiency:</strong> Quick application process and real-time updates</p>
                <p>• <strong>Connection:</strong> Direct line between talent and opportunity</p>
                <p>• <strong>Support:</strong> Reliable platform with dedicated assistance</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Technology</h2>
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Built With Modern Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold text-gray-800">Frontend</h4>
                    <p className="text-sm text-gray-600">React, JavaScript, Tailwind CSS</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold text-gray-800">Backend</h4>
                    <p className="text-sm text-gray-600">Node.js, Express, MongoDB</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold text-gray-800">Database</h4>
                    <p className="text-sm text-gray-600">MongoDB with Mongoose</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold text-gray-800">Authentication</h4>
                    <p className="text-sm text-gray-600">JWT with HTTP-only cookies</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>Email:</strong> support@dreamhire.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +91 9398730870
                  </p>
                  <p className="text-gray-600">
                    <strong>Address:</strong> Hitech City, Hyderabad, Telangana, India
                  </p>
                  <p className="text-gray-600">
                    <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
