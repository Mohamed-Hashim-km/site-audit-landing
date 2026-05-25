'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

const SERVICE_OPTIONS = [
  'Web Development',
  'Branding & Design',
  'Custom App Development',
  'SEO & Digital Marketing'
]

const BUDGET_OPTIONS = [
  'Under $5k',
  '$5k - $10k',
  '$10k - $25k',
  '$25k+'
]

const TIMELINE_OPTIONS = [
  'Immediate',
  '1-3 Months',
  '3-6 Months',
  'Flexible'
]

const TIME_OPTIONS = [
  'Morning',
  'Afternoon',
  'Evening'
]

function MultiSelectDropdown({ selected, onChange, hasError }: { selected: string, onChange: (val: string) => void, hasError?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedArray = selected ? selected.split(',').map(s => s.trim()).filter(Boolean) : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    let newSelected = [...selectedArray]
    if (newSelected.includes(option)) {
      newSelected = newSelected.filter(item => item !== option)
    } else {
      newSelected.push(option)
    }
    onChange(newSelected.join(', '))
  }

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      <div className={`multi-select-header ${hasError ? 'input-error' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className={selectedArray.length === 0 ? 'placeholder' : ''} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedArray.length === 0 ? 'Select services...' : selectedArray.join(', ')}
        </span>
        <svg className={`chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div className="multi-select-dropdown">
          {SERVICE_OPTIONS.map(option => (
            <div 
              key={option} 
              className="multi-select-option" 
              onClick={() => toggleOption(option)}
            >
              <div className={`checkbox ${selectedArray.includes(option) ? 'checked' : ''}`}>
                {selectedArray.includes(option) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SingleSelectDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder,
  hasError 
}: { 
  value: string; 
  options: string[]; 
  onChange: (val: string) => void; 
  placeholder?: string;
  hasError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="single-select-container" ref={dropdownRef}>
      <div className={`single-select-header ${hasError ? 'input-error' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className={!value ? 'placeholder' : ''} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder || 'Select...'}
        </span>
        <svg className={`chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div className="single-select-dropdown">
          {options.map(option => (
            <div 
              key={option} 
              className={`single-select-option ${value === option ? 'selected' : ''}`} 
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>
              {value === option && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



function HomeContent() {
  const searchParams = useSearchParams()
  const reportId = searchParams.get('report_id')
  const leadId = searchParams.get('lead_id')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    industry: '',
    service: '',
    budget: '$5k - $10k',
    timeline: '1-3 Months',
    goals: '',
    challenges: '',
    preferred_date: '',
    preferred_time: 'Morning',
  })

  // UI State
  const [isHydrated, setIsHydrated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  // Scores State
  const [scores, setScores] = useState({
    desktopScore: 98,
    mobileScore: 73,
    seoScore: 75,
    overall: 82,
  })
  const [animateWidths, setAnimateWidths] = useState(false)
  const [hasReport, setHasReport] = useState(false)

  // Client-side hydration and localStorage check
  useEffect(() => {
    setIsHydrated(true)
    const savedSuccess = localStorage.getItem('megamind_consultation_success')
    const savedDetails = localStorage.getItem('megamind_booking_details')
    if (savedSuccess === 'true' && savedDetails) {
      try {
        setBookingDetails(JSON.parse(savedDetails))
        setSuccess(true)
      } catch (err) {
        console.error('Failed to parse saved booking details:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (!reportId && !leadId) {
      setLoading(false)
      // Animate default scores after a brief delay
      setTimeout(() => setAnimateWidths(true), 200)
      return
    }

    const fetchLeadData = async () => {
      try {
        const query = new URLSearchParams()
        if (reportId) query.append('report_id', reportId)
        if (leadId) query.append('lead_id', leadId)

        const res = await fetch(`/api/get-scores?${query.toString()}`)
        const data = await res.json()

        if (data.success) {
          // Pre-fill form fields
          setFormData(prev => ({
            ...prev,
            name: data.lead?.name || prev.name,
            email: data.lead?.email || prev.email,
            phone: data.lead?.phone || prev.phone,
            company: data.lead?.business_type || prev.company,
            website: data.lead?.website_url || prev.website,
          }))

          if (data.hasReport) {
            setHasReport(true)
            setScores({
              desktopScore: data.scores.desktopScore || 98,
              mobileScore: data.scores.mobileScore || 73,
              seoScore: data.scores.seoScore || 75,
              overall: data.scores.overall || 82
            })
          }

          // If database check says they already have a consultation, show success
          if (data.hasConsultation && data.consultation) {
            const details = {
              name: data.consultation.name,
              email: data.consultation.email,
              service: data.consultation.service,
              date: data.consultation.date,
              time: data.consultation.time,
            }
            setBookingDetails(details)
            setSuccess(true)
            localStorage.setItem('megamind_consultation_success', 'true')
            localStorage.setItem('megamind_booking_details', JSON.stringify(details))
          }
        }
      } catch (err) {
        console.error('Failed to load lead details:', err)
      } finally {
        setLoading(false)
        // Animate actual scores after state has settled
        setTimeout(() => setAnimateWidths(true), 200)
      }
    }

    fetchLeadData()
  }, [reportId, leadId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear field-specific validation error on change
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.'
      }
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required.'
    } else if (!formData.website.trim().includes('.')) {
      newErrors.website = 'Please enter a valid website URL (e.g. acme.com).'
    }

    if (!formData.service.trim()) {
      newErrors.service = 'Please select at least one core service.'
    }

    if (!formData.goals.trim()) {
      newErrors.goals = 'Main Business Goals are required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setErrors({})

    if (!validateForm()) {
      // Scroll to form or first error
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        lead_id: leadId || null,
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const details = {
          name: formData.name,
          email: formData.email,
          service: formData.service,
          date: formData.preferred_date,
          time: formData.preferred_time,
        }
        setBookingDetails(details)
        setSuccess(true)
        
        // Save to localStorage so it is persistent on refresh
        localStorage.setItem('megamind_consultation_success', 'true')
        localStorage.setItem('megamind_booking_details', JSON.stringify(details))

        // Scroll to success card
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        setError(data.error || 'Failed to submit booking. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('A network error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      {/* Sticky Header */}
      <header className="header">
        <div className="container nav">
          <Image 
            src="/megamindlogoBlack.webp" 
            alt="Megamind Logo" 
            width={200} // Adjusted to a standard navbar logo width
            height={80} // Adjusted height (change this based on your actual image aspect ratio)
            priority    // Prioritizes loading for above-the-fold images to improve LCP
            style={{ objectFit: 'contain' }} // Ensures the logo doesn't stretch
          />
          <button onClick={() => scrollToSection('booking-form')} className="nav-cta">
            Book Consultation
          </button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="4.5" fill="#E31313" stroke="#E31313" strokeWidth="3" strokeOpacity="0.2"/>
              </svg>
              1-on-1 Consultation
            </div>
            <h1>Website & Brand Audit Consultation</h1>
            <p>
              Review your customized website audit with our elite developers and designers. 
              Let's analyze your results, resolve technical issues, and engineer a roadmap 
              to skyrocket your search rankings, conversion rates, and revenue.
            </p>
            <div className="hero-actions">
              <button onClick={() => scrollToSection('booking-form')} className="btn-primary">
                Book Free Consultation
              </button>
              <button onClick={() => scrollToSection('step-guide')} className="btn-secondary">
                How It Works &rarr;
              </button>
            </div>
          </div>

          <div>
            <div className="audit-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>
                {hasReport ? 'Your AI Audit Result' : 'Studio Scoring System'}
              </h3>
              
              <div>
                <div className="score-row">
                  <span>Desktop Score</span>
                  <span>{animateWidths ? `${scores.desktopScore}%` : 'Loading...'}</span>
                </div>
                <div className="bar">
                  <span style={{ width: animateWidths ? `${scores.desktopScore}%` : '0%' }}></span>
                </div>

                <div className="score-row">
                  <span>Mobile Score</span>
                  <span>{animateWidths ? `${scores.mobileScore}%` : 'Loading...'}</span>
                </div>
                <div className="bar">
                  <span style={{ width: animateWidths ? `${scores.mobileScore}%` : '0%' }}></span>
                </div>

                <div className="score-row">
                  <span>SEO Score</span>
                  <span>{animateWidths ? `${scores.seoScore}%` : 'Loading...'}</span>
                </div>
                <div className="bar">
                  <span style={{ width: animateWidths ? `${scores.seoScore}%` : '0%' }}></span>
                </div>
              </div>

              <div className="mini-grid">
                <div className="mini-card">
                  <strong>{scores.overall}</strong>
                  <small>Overall Website Score</small>
                </div>
                <div className="mini-card">
                  <strong style={{ fontSize: '15px', wordBreak: 'break-all' }}>
                    {formData.website ? formData.website.replace(/https?:\/\/(www\.)?/, '') : 'megamind.studio'}
                  </strong>
                  <small>Target Domain</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="step-guide" className="section alt">
        <div className="container">
          <div className="center">
            <h2>Three Steps to Transform Your Business</h2>
            <p>Our consultation is designed to deliver immediate clarity and actionable next steps.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Share Requirements</h3>
              <p>Fill out the form below detailing your services, target budget, and core growth challenges.</p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Select Date & Time</h3>
              <p>Choose your preferred date and time range for our 1-on-1 strategy deep-dive call.</p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Execute Blueprint</h3>
              <p>Get a direct walk-through of your audit results, competitive gaps, and a step-by-step action plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="booking-form" className="section">
        <div className="container form-section">
          <div className="form-note">
            <h2>Let's build something exceptional together.</h2>
            <p>
              Our team of experts will review your website structure, loading speeds, brand metrics, 
              and organic rankings before our call to ensure you leave with maximum value.
            </p>
            <ul className="check-list">
              <li>Detailed PDF Roadmap</li>
              <li>Competitive Gap Review</li>
              <li>Tech Stack Audit</li>
              <li>1-on-1 Live Developer Time</li>
            </ul>
          </div>

          <div>
            {!isHydrated || loading ? (
              <div style={{ display: 'flex', minHeight: '380px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-premium)', width: '100%' }}>
                <div style={{ fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                  <svg style={{ animation: 'spin 1.5s linear infinite', width: '20px', height: '20px', color: 'var(--brand)', marginRight: '8px' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(227, 19, 19, 0.1)" strokeWidth="4" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading Booking Details...</span>
                </div>
              </div>
            ) : success && bookingDetails ? (
              <div className="success-card">
                <div className="success-icon">✓</div>
                <h2>Consultation Booked!</h2>
                <p>
                  Thank you, <strong>{bookingDetails.name}</strong>. We have received your requirements 
                  and scheduled your consultation details. We will email you at <strong>{bookingDetails.email}</strong> to finalize.
                </p>
                <div className="booking-summary">
                  <div className="booking-summary-row">
                    <span>Requested Service</span>
                    <span>{bookingDetails.service}</span>
                  </div>
                  {bookingDetails.date && (
                    <div className="booking-summary-row">
                      <span>Preferred Date</span>
                      <span>{new Date(bookingDetails.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="booking-summary-row">
                    <span>Preferred Time</span>
                    <span>{bookingDetails.time}</span>
                  </div>
                </div>
                <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#16a34a', fontSize: '14px', fontWeight: 700, lineHeight: 1.5 }}>
                  Your consultation strategy call has been locked in. Our lead engineer and design partner are analyzing your domain details to build your roadmap.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Request Details</h3>
                
                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
                    {error}
                  </div>
                )}
 
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className={errors.name ? 'input-error' : ''}
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && <p className="field-error">{errors.name}</p>}
                  </div>
                  
                  <div className="field">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className={errors.email ? 'input-error' : ''}
                      placeholder="e.g. john@company.com"
                    />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
 
                  <div className="field">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="e.g. +1 (555) 000-0000"
                    />
                  </div>
 
                  <div className="field">
                    <label htmlFor="company">Company / Brand Name</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
 
                  <div className="field full">
                    <label htmlFor="website">Website URL *</label>
                    <input 
                      type="text" 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      className={errors.website ? 'input-error' : ''}
                      placeholder="e.g. www.acme.com"
                    />
                    {errors.website && <p className="field-error">{errors.website}</p>}
                  </div>
 
                  <div className="field">
                    <label htmlFor="industry">Industry</label>
                    <input 
                      type="text" 
                      id="industry" 
                      name="industry" 
                      value={formData.industry} 
                      onChange={handleInputChange} 
                      placeholder="e.g. E-commerce, SaaS"
                    />
                  </div>
 
                  <div className="field">
                    <label htmlFor="service">Core Service Needed *</label>
                    <MultiSelectDropdown 
                      selected={formData.service} 
                      onChange={(val) => {
                        setFormData(prev => ({ ...prev, service: val }))
                        if (errors.service) {
                          setErrors(prev => {
                            const copy = { ...prev }
                            delete copy.service
                            return copy
                          })
                        }
                      }} 
                      hasError={!!errors.service}
                    />
                    {errors.service && <p className="field-error">{errors.service}</p>}
                  </div>
 
                  <div className="field">
                    <label htmlFor="budget">Target Budget</label>
                    <SingleSelectDropdown
                      value={formData.budget}
                      options={BUDGET_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, budget: val }))}
                      placeholder="Select budget..."
                    />
                  </div>
 
                  <div className="field">
                    <label htmlFor="timeline">Timeline</label>
                    <SingleSelectDropdown
                      value={formData.timeline}
                      options={TIMELINE_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, timeline: val }))}
                      placeholder="Select timeline..."
                    />
                  </div>
 
                  <div className="field full">
                    <label htmlFor="goals">Main Business Goals *</label>
                    <textarea 
                      id="goals" 
                      name="goals" 
                      value={formData.goals} 
                      onChange={handleInputChange} 
                      className={errors.goals ? 'input-error' : ''}
                      placeholder="What are you hoping to achieve with this project? (e.g. increase leads by 50%, improve checkout conversion)"
                    ></textarea>
                    {errors.goals && <p className="field-error">{errors.goals}</p>}
                  </div>
 
                  <div className="field full">
                    <label htmlFor="challenges">Technical / Design Challenges</label>
                    <textarea 
                      id="challenges" 
                      name="challenges" 
                      value={formData.challenges} 
                      onChange={handleInputChange} 
                      placeholder="Are there specific roadblocks you are facing? (e.g. slow loading speeds, high mobile bounce rates)"
                    ></textarea>
                  </div>
 
                  <div className="field">
                    <label htmlFor="preferred_date">Preferred Date</label>
                    <input 
                      type="date" 
                      id="preferred_date" 
                      name="preferred_date" 
                      value={formData.preferred_date} 
                      onChange={handleInputChange} 
                    />
                  </div>
 
                  <div className="field">
                    <label htmlFor="preferred_time">Preferred Time of Day</label>
                    <SingleSelectDropdown
                      value={formData.preferred_time}
                      options={TIME_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, preferred_time: val }))}
                      placeholder="Select preferred time..."
                    />
                  </div>
                </div>
 
                <button type="submit" disabled={submitting || loading} className="submit-btn">
                  {submitting ? 'Booking Consultation...' : 'Confirm Consultation Booking'}
                </button>
                
                <p className="small-copy">
                  By clicking above, you agree to our privacy policy. We will prepare your website 
                  metrics checklist prior to our strategy call.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Megamind Studios. All rights reserved. Strategic audits for high-growth brands.</p>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', fontFamily: 'sans-serif', color: '#6b7280' }}>
        <div>Loading consultation details...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
