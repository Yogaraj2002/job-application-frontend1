import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import './JobForm.css';

function JobForm({ onClose }) {
  const { register, handleSubmit } = useForm();
  const modalRef = useRef();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const onSubmit = async (data) => {
    const jobData = {
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      location: data.location,
      jobType: data.jobType,
      salaryMin: data.minSalary,
      salaryMax: data.maxSalary,
      applicationDeadline: data.applicationDeadline,
      experience: data.experience,
      description: data.description
    };

    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        alert("Job created successfully!");
        onClose();
      } else {
        console.error("Failed to create job:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="job-form-backdrop">
      <div className="job-form-modal" ref={modalRef}>
        <h2 className="modal-title">Create Job Opening</h2>
        <form className="job-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" {...register('jobTitle')} className="form-input" />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" {...register('companyName')} className="form-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" {...register('location')} className="form-input" />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select {...register('jobType')} className="form-dropdown">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Range</label>
              <div className="salary-inputs">
                <input type="number" {...register('minSalary')} className="salary-input-half" placeholder="₹0 /Month"/>
                <input type="number" {...register('maxSalary')} className="salary-input-half" placeholder="₹1,00,000 /Month"/>
              </div>
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input type="date" {...register('applicationDeadline')} className="form-input"/>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Job Description</label>
            <textarea {...register('description')} className="form-textarea"></textarea>
          </div>
          <div className="form-group full-width">
            <label>Experience</label>
            <input type="text" {...register('experience')} className="form-input" placeholder="e.g., 2-4 years"/>
          </div>

          <div className="form-actions">
            <button type="button" className="draft-btn" onClick={onClose}>Save Draft</button>
            <button type="submit" className="publish-btn">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
