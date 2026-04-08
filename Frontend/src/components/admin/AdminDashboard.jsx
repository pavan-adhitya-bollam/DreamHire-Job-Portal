import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/applications', {
        withCredentials: true
      });
      console.log('Applications API Response:', response.data);
      setApplications(response.data.applications);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to fetch applications');
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/stats', {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/applications/${applicationId}/accept`, {}, {
        withCredentials: true
      });
      fetchApplications();
      fetchStats();
    } catch (error) {
      setError('Failed to accept application');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/applications/${applicationId}/reject`, {}, {
        withCredentials: true
      });
      fetchApplications();
      fetchStats();
    } catch (error) {
      setError('Failed to reject application');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/admin/logout', {}, {
        withCredentials: true
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/admin/login');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'accepted': return '#d1fae5';
      case 'rejected': return '#fee2e2';
      default: return '#fef3c7';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <p>Job Application Management System</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <div className="stat-number">{stats.totalApplications || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-number pending">
            {stats.stats?.find(s => s._id === 'pending')?.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>Accepted</h3>
          <div className="stat-number accepted">
            {stats.stats?.find(s => s._id === 'accepted')?.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <div className="stat-number rejected">
            {stats.stats?.find(s => s._id === 'rejected')?.count || 0}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="applications-container">
        <h2>Job Applications</h2>
        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : (
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.applicant?.fullname || 'N/A'}</td>
                    <td>{app.applicant?.email || 'N/A'}</td>
                    <td>{app.applicant?.phoneNumber || 'N/A'}</td>
                    <td>{app.job?.title || 'N/A'}</td>
                    <td>{app.job?.company || 'N/A'}</td>
                    <td>
                      <a 
                        href={app.resume?.startsWith('http') ? app.resume : `http://localhost:5001/${app.resume}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resume-link"
                      >
                        View Resume
                      </a>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusBg(app.status),
                          color: getStatusColor(app.status)
                        }}
                      >
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {app.status === 'pending' && (
                          <>
                            <button 
                              className="accept-btn"
                              onClick={() => handleAccept(app._id)}
                            >
                              Accept
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => handleReject(app._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status !== 'pending' && (
                          <span className="action-complete">
                            {app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="no-applications">No applications found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
