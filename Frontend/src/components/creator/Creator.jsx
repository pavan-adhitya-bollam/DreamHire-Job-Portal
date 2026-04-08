import React from 'react'
import Navbar from '../components_lite/Navbar'

const Creator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 my-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🚀 About This Project
        </h1>

        {/* MAIN CARD */}
        <div className="bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition">

          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Job Portal System
          </h2>

          <p className="text-gray-600 mb-4">
            This is a full-stack Job Portal web application developed using the MERN stack. 
            It allows users to search for jobs, apply with resumes, and manage their applications efficiently.
          </p>

          <p className="text-gray-600 mb-4">
            The platform provides two types of users: <strong>Students</strong> and <strong>Recruiters</strong>. 
            Students can browse jobs, apply, and track applications, while recruiters can post jobs and manage applicants.
          </p>

        </div>

        {/* FEATURES */}
        <div className="bg-white p-8 rounded-xl shadow-lg border mt-6 hover:shadow-xl transition">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ✨ Key Features
          </h2>

          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>🔍 Job Search with filters (location, technology, salary, experience)</li>
            <li>📄 Apply to jobs with resume upload</li>
            <li>💾 Save jobs for later</li>
            <li>📊 Track applied jobs and application status</li>
            <li>🧑‍💼 Recruiter dashboard to post and manage jobs</li>
            <li>🔐 Authentication using JWT</li>
          </ul>

        </div>

        {/* TECH STACK */}
        <div className="bg-white p-8 rounded-xl shadow-lg border mt-6 hover:shadow-xl transition">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛠️ Tech Stack
          </h2>

          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li><strong>Frontend:</strong> React.js, Tailwind CSS</li>
            <li><strong>Backend:</strong> Node.js, Express.js</li>
            <li><strong>Database:</strong> MongoDB</li>
            <li><strong>State Management:</strong> Redux Toolkit</li>
          </ul>

        </div>

        {/* YOUR INFO */}
        <div className="bg-white p-8 rounded-xl shadow-lg border mt-6 hover:shadow-xl transition">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            👨‍💻 Developer
          </h2>

          <p className="text-gray-600">
            Developed by <strong>Pavan Adhitya Bollam</strong>
          </p>

          <p className="text-gray-600 mt-2">
            Passionate about full-stack development and currently exploring DevOps technologies.
          </p>

        </div>

      </div>
    </div>
  )
}

export default Creator;