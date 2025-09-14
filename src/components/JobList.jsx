import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import './JobList.css';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salaryRange, setSalaryRange] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState('Job type');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/jobs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
          setError('');
        } else {
          console.error("API returned non-array:", data);
          setJobs([]);
          setError('Unexpected API response');
        }
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setJobs([]);
        setError('Failed to fetch jobs');
      })
      .finally(() => setLoading(false));
  }, [API_BASE]);

  const handleSalaryChange = (e) => setSalaryRange(e.target.value);
const filteredJobs = Array.isArray(jobs)
  ? jobs.filter(job => {
      const matchesSearch =
        (job.jobtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = (job.location || '').toLowerCase().includes(locationQuery.toLowerCase());

      const matchesJobType =
        jobType === 'Job type' || (job.jobtype || '').toLowerCase() === jobType.toLowerCase();

      const salaryMin = parseInt(job.salarymin, 10) || 0;
      const salaryMax = parseInt(job.salarymax, 10) || Infinity;
      const selectedMin = salaryRange * 1000;
      const selectedMax = (parseInt(salaryRange) + 20) * 1000;

      const matchesSalary = salaryMin <= selectedMax && salaryMax >= selectedMin;

      return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
    })
  : [];


  return (
    <div className="job-list-page">
      <div className="filters-bar">
        <div className="filter-group">
          <FaSearch className="filter-icon" />
          <input 
            type="text" 
            placeholder="Search By Job Title, Role" 
            className="filter-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaMapMarkerAlt className="filter-icon" />
          <input 
            type="text" 
            placeholder="Preferred Location" 
            className="filter-input" 
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaBriefcase className="filter-icon" />
          <select 
            className="filter-dropdown"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="Job type">Job type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className="salary-range-container">
          <div className="salary-range-label">
            Salary Per Month &emsp; ₹{salaryRange}k - ₹{parseInt(salaryRange) + 20}k
          </div>
          <input 
            type="range"
            min="10" 
            max="150" 
            value={salaryRange}
            onChange={handleSalaryChange}
            className="salary-range-slider"
          />
        </div>
      </div>

      <div className="job-cards-grid">
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          <p>No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default JobList;
