"use client";

import { useState } from "react";

const STEPS = [
  "Applicant 1",
  "Applicant 2",
  "Address",
  "Review"
];

export default function FactFindForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    applicant1: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      employmentStatus: "Full-time",
    },
    applicant2: {
      hasApplicant2: "no",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      employmentStatus: "Full-time",
    },
    address: {
      street: "",
      city: "",
      state: "",
      postcode: "",
      residentialStatus: "Renting",
    }
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 0 && formData.applicant2.hasApplicant2 === "no") {
        // Skip applicant 2 if they select 'no'
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (currentStep === 2 && formData.applicant2.hasApplicant2 === "no") {
        setCurrentStep(0);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <>
      <div className="step-indicator">
        {STEPS.map((step, index) => {
          let className = "step-item ";
          if (index === currentStep) className += "active";
          else if (index < currentStep) className += "completed";
          
          return (
            <div key={index} className={className}>
              <div className="step-circle">
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span className="step-label">{step}</span>
            </div>
          );
        })}
      </div>

      <div className="glass-panel form-card">
        {currentStep === 0 && (
          <div className="form-section">
            <h2 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Primary Applicant
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" placeholder="e.g. Jane" 
                  value={formData.applicant1.firstName}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, firstName: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" placeholder="e.g. Doe"
                  value={formData.applicant1.lastName}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, lastName: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="jane.doe@example.com"
                  value={formData.applicant1.email}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, email: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="0400 000 000"
                  value={formData.applicant1.phone}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, phone: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input"
                  value={formData.applicant1.dob}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, dob: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select className="form-input"
                  value={formData.applicant1.employmentStatus}
                  onChange={(e) => setFormData({...formData, applicant1: {...formData.applicant1, employmentStatus: e.target.value}})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Self-employed</option>
                  <option>Casual</option>
                  <option>Unemployed</option>
                </select>
              </div>
              
              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <label className="form-label" style={{marginBottom: '0.5rem', display: 'block'}}>Will there be a second applicant?</label>
                <div className="radio-group">
                  <label className="radio-card">
                    <input type="radio" name="hasApp2" value="yes" 
                      checked={formData.applicant2.hasApplicant2 === "yes"}
                      onChange={() => setFormData({...formData, applicant2: {...formData.applicant2, hasApplicant2: "yes"}})}
                    />
                    <div className="radio-content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      <span>Yes, joint application</span>
                    </div>
                  </label>
                  <label className="radio-card">
                    <input type="radio" name="hasApp2" value="no" 
                      checked={formData.applicant2.hasApplicant2 === "no"}
                      onChange={() => setFormData({...formData, applicant2: {...formData.applicant2, hasApplicant2: "no"}})}
                    />
                    <div className="radio-content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span>No, single application</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="form-section">
            <h2 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="11" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
              Secondary Applicant
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" placeholder="e.g. John"
                  value={formData.applicant2.firstName}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, firstName: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" placeholder="e.g. Doe"
                  value={formData.applicant2.lastName}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, lastName: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="john.doe@example.com"
                  value={formData.applicant2.email}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, email: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="0400 000 000"
                  value={formData.applicant2.phone}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, phone: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input"
                  value={formData.applicant2.dob}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, dob: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select className="form-input"
                  value={formData.applicant2.employmentStatus}
                  onChange={(e) => setFormData({...formData, applicant2: {...formData.applicant2, employmentStatus: e.target.value}})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Self-employed</option>
                  <option>Casual</option>
                  <option>Unemployed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-section">
            <h2 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Current Residential Address
            </h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Street Address</label>
                <input type="text" className="form-input" placeholder="123 Typical Street"
                  value={formData.address.street}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Suburb / City</label>
                <input type="text" className="form-input" placeholder="Sydney"
                  value={formData.address.city}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-input"
                  value={formData.address.state}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                >
                  <option value="">Select a state</option>
                  <option>NSW</option>
                  <option>VIC</option>
                  <option>QLD</option>
                  <option>WA</option>
                  <option>SA</option>
                  <option>TAS</option>
                  <option>ACT</option>
                  <option>NT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Postcode</label>
                <input type="text" className="form-input" placeholder="2000"
                  value={formData.address.postcode}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, postcode: e.target.value}})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Living Situation</label>
                <select className="form-input"
                  value={formData.address.residentialStatus}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, residentialStatus: e.target.value}})}
                >
                  <option>Renting</option>
                  <option>Living with Parents/Family</option>
                  <option>Own Outright</option>
                  <option>Paying Mortgage</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-section">
            <h2 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Review & Submit
            </h2>
            <div className="review-container" style={{background: 'var(--input-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--input-border)'}}>
              <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-base)'}}>Applicant 1</h3>
              <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Name:</span> {formData.applicant1.firstName} {formData.applicant1.lastName}</p>
              <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Email:</span> {formData.applicant1.email}</p>
              <p style={{marginBottom: '1.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Employment:</span> {formData.applicant1.employmentStatus}</p>

              {formData.applicant2.hasApplicant2 === "yes" && (
                <>
                  <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-base)'}}>Applicant 2</h3>
                  <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Name:</span> {formData.applicant2.firstName} {formData.applicant2.lastName}</p>
                  <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Email:</span> {formData.applicant2.email}</p>
                  <p style={{marginBottom: '1.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Employment:</span> {formData.applicant2.employmentStatus}</p>
                </>
              )}

              <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-base)'}}>Address</h3>
              <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Street:</span> {formData.address.street}</p>
              <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Location:</span> {formData.address.city}, {formData.address.state} {formData.address.postcode}</p>
              <p style={{marginBottom: '0.5rem'}}><span style={{color: 'var(--text-secondary)'}}>Status:</span> {formData.address.residentialStatus}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{opacity: currentStep === 0 ? 0 : 1}}
          >
            ← Back
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={isLastStep ? () => alert("Form submitted successfully!") : handleNext}
          >
            {isLastStep ? "Submit Application" : "Continue →"}
          </button>
        </div>
      </div>
    </>
  );
}
