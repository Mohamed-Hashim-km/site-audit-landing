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
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between w-full border rounded-xl py-3.5 px-4 bg-white cursor-pointer transition-all duration-200 text-[15px] hover:border-gray-400 ${hasError ? 'border-[#e31313] shadow-[0_0_0_4px_rgba(227,19,19,0.15)]' : 'border-gray-300'}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedArray.length === 0 ? 'text-gray-500' : 'text-[#0f0f11]'} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedArray.length === 0 ? 'Select services...' : selectedArray.join(', ')}
        </span>
        <svg className={`transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-2 z-50 flex flex-col gap-1">
          {SERVICE_OPTIONS.map(option => (
            <div 
              key={option} 
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-150 text-sm font-semibold select-none hover:bg-gray-50 text-[#0f0f11]" 
              onClick={() => toggleOption(option)}
            >
              <div className={`w-[18px] h-[18px] border-2 rounded flex items-center justify-center transition-all duration-150 ${selectedArray.includes(option) ? 'bg-[#e31313] border-[#e31313]' : 'border-gray-300'}`}>
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
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between w-full border rounded-xl py-3.5 px-4 bg-white cursor-pointer transition-all duration-200 text-[15px] hover:border-gray-400 ${hasError ? 'border-[#e31313] shadow-[0_0_0_4px_rgba(227,19,19,0.15)]' : 'border-gray-300'}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? 'text-gray-500' : 'text-[#0f0f11]'} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder || 'Select...'}
        </span>
        <svg className={`transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-2 z-50 flex flex-col gap-1">
          {options.map(option => (
            <div 
              key={option} 
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-150 text-sm font-semibold select-none hover:bg-gray-50 ${value === option ? 'bg-[#e31313]/5 text-[#e31313]' : 'text-[#0f0f11]'}`} 
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>
              {value === option && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e31313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
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
    <div className="flex flex-col min-h-screen font-sans text-[#0f0f11] bg-white leading-relaxed antialiased">
      {/* Sticky Header */}
      <header className="py-2.5 border-b border-gray-200 bg-white/85 backdrop-blur-md sticky top-0 z-[100] transition-all duration-300">
        <div className="w-[92%] max-w-[1180px] mx-auto flex items-center justify-between gap-5">
          <div className="text-2xl font-black tracking-tighter text-[#0f0f11] flex items-center">
            <Image 
              src="/megamindlogoBlack.webp" 
              alt="Megamind Logo" 
              width={200}
              height={80}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button onClick={() => scrollToSection('booking-form')} className="hidden sm:inline-block border-none bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white py-3 px-6 rounded-xl font-extrabold text-sm shadow-[0_4px_14px_rgba(227,19,19,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(227,19,19,0.35)] transition-all duration-300 cursor-pointer">
            Book Consultation
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[60px] pb-[60px] md:pt-[100px] md:pb-[80px] relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(227,19,19,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(227,19,19,0.03),transparent_50%),linear-gradient(180deg,#ffffff_0%,#fbfbfc_100%)]">
        <div className="w-[92%] max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-[60px] items-center">
          <div>
            <div className="text-[#e31313] text-[13px] uppercase font-extrabold tracking-[2px] mb-5 inline-flex items-center gap-2 bg-[#e31313]/5 py-1.5 px-3.5 rounded-full border border-[#e31313]/10">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="4.5" fill="#E31313" stroke="#E31313" strokeWidth="3" strokeOpacity="0.2"/>
              </svg>
              1-on-1 Consultation
            </div>
            <h1 className="text-[clamp(38px,5.5vw,68px)] leading-[1.05] tracking-[-2.5px] mb-6 font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0f0f11] via-[#0f0f11] to-[#3a3a40]">
              Website & Brand Audit Consultation
            </h1>
            <p className="text-gray-500 text-lg max-w-[600px] mb-9 leading-relaxed">
              Review your customized website audit with our elite developers and designers. 
              Let's analyze your results, resolve technical issues, and engineer a roadmap 
              to skyrocket your search rankings, conversion rates, and revenue.
            </p>
            <div className="flex gap-5 flex-wrap items-center">
              <button onClick={() => scrollToSection('booking-form')} className="inline-block border-none bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white py-4 px-8 rounded-xl font-extrabold shadow-[0_10px_25px_rgba(227,19,19,0.25)] hover:-translate-y-[3px] hover:shadow-[0_15px_35px_rgba(227,19,19,0.4)] transition-all duration-300 cursor-pointer">
                Book Free Consultation
              </button>
              <button onClick={() => scrollToSection('step-guide')} className="text-[#0f0f11] bg-transparent font-extrabold border-b-2 border-[#e31313] pt-1 px-0.5 pb-0.5 hover:text-[#e31313] hover:border-[#c71010] transition-all duration-200 text-base cursor-pointer">
                How It Works &rarr;
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white border border-[#111111]/5 rounded-[28px] p-6 sm:p-9 shadow-[0_25px_60px_-12px_rgba(15,15,17,0.12)] relative transition-transform duration-400 hover:-translate-y-1 hover:shadow-[0_30px_70px_-10px_rgba(15,15,17,0.15)]">
              <h3 className="text-[18px] font-extrabold mb-6">
                {hasReport ? 'Your AI Audit Result' : 'Studio Scoring System'}
              </h3>
              
              <div>
                <div className="flex justify-between mb-2.5 font-bold text-[15px]">
                  <span className="text-[#0f0f11]">Desktop Score</span>
                  <span className="text-gray-500 font-medium text-[13px] bg-gray-100 py-0.5 px-2 rounded-md">{animateWidths ? `${scores.desktopScore}%` : 'Loading...'}</span>
                </div>
                <div className="h-2 bg-[#f1f2f4] rounded-full overflow-hidden mb-6 relative">
                  <span className="block h-full bg-gradient-to-br from-[#e31313] to-[#ff4b4b] rounded-full transition-all duration-1000 ease-out relative" style={{ width: animateWidths ? `${scores.desktopScore}%` : '0%' }}></span>
                </div>

                <div className="flex justify-between mb-2.5 font-bold text-[15px]">
                  <span className="text-[#0f0f11]">Mobile Score</span>
                  <span className="text-gray-500 font-medium text-[13px] bg-gray-100 py-0.5 px-2 rounded-md">{animateWidths ? `${scores.mobileScore}%` : 'Loading...'}</span>
                </div>
                <div className="h-2 bg-[#f1f2f4] rounded-full overflow-hidden mb-6 relative">
                  <span className="block h-full bg-gradient-to-br from-[#e31313] to-[#ff4b4b] rounded-full transition-all duration-1000 ease-out relative" style={{ width: animateWidths ? `${scores.mobileScore}%` : '0%' }}></span>
                </div>

                <div className="flex justify-between mb-2.5 font-bold text-[15px]">
                  <span className="text-[#0f0f11]">SEO Score</span>
                  <span className="text-gray-500 font-medium text-[13px] bg-gray-100 py-0.5 px-2 rounded-md">{animateWidths ? `${scores.seoScore}%` : 'Loading...'}</span>
                </div>
                <div className="h-2 bg-[#f1f2f4] rounded-full overflow-hidden mb-6 relative">
                  <span className="block h-full bg-gradient-to-br from-[#e31313] to-[#ff4b4b] rounded-full transition-all duration-1000 ease-out relative" style={{ width: animateWidths ? `${scores.seoScore}%` : '0%' }}></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-[30px]">
                <div className="bg-gray-50 p-5 rounded-[20px] border border-gray-200 transition-all duration-300 hover:bg-white hover:border-[#e31313] hover:-translate-y-0.5 hover:shadow-md">
                  <strong className="block text-[26px] font-black text-[#0f0f11] mb-1">{scores.overall}</strong>
                  <small className="text-gray-500 font-semibold text-[13px] leading-snug">Overall Website Score</small>
                </div>
                <div className="bg-gray-50 p-5 rounded-[20px] border border-gray-200 transition-all duration-300 hover:bg-white hover:border-[#e31313] hover:-translate-y-0.5 hover:shadow-md">
                  <strong className="block text-[15px] font-black text-[#0f0f11] mb-1 break-all">
                    {formData.website ? formData.website.replace(/https?:\/\/(www\.)?/, '') : 'megamind.studio'}
                  </strong>
                  <small className="text-gray-500 font-semibold text-[13px] leading-snug">Target Domain</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="step-guide" className="py-[60px] md:py-[90px] bg-gray-50 border-y border-gray-200">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="text-center max-w-[720px] mx-auto mb-[60px]">
            <h2 className="text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-1.5px] mb-5 font-black text-[#0f0f11]">Three Steps to Transform Your Business</h2>
            <p className="text-gray-500 text-lg">Our consultation is designed to deliver immediate clarity and actionable next steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div className="bg-white border border-gray-200 rounded-[24px] py-10 px-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#e31313]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white rounded-2xl grid place-items-center mx-auto mb-6 text-[22px] font-black shadow-[0_8px_20px_rgba(227,19,19,0.25)]">1</div>
              <h3 className="text-[22px] font-extrabold text-[#0f0f11] mb-3">Share Requirements</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">Fill out the form below detailing your services, target budget, and core growth challenges.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[24px] py-10 px-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#e31313]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white rounded-2xl grid place-items-center mx-auto mb-6 text-[22px] font-black shadow-[0_8px_20px_rgba(227,19,19,0.25)]">2</div>
              <h3 className="text-[22px] font-extrabold text-[#0f0f11] mb-3">Select Date & Time</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">Choose your preferred date and time range for our 1-on-1 strategy deep-dive call.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[24px] py-10 px-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#e31313]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white rounded-2xl grid place-items-center mx-auto mb-6 text-[22px] font-black shadow-[0_8px_20px_rgba(227,19,19,0.25)]">3</div>
              <h3 className="text-[22px] font-extrabold text-[#0f0f11] mb-3">Execute Blueprint</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">Get a direct walk-through of your audit results, competitive gaps, and a step-by-step action plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="booking-form" className="py-[60px] md:py-[90px]">
        <div className="w-[92%] max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-[50px] items-start">
          <div className="bg-[#0f0f11] text-white rounded-[28px] p-6 sm:p-10 md:sticky md:top-[110px] shadow-lg border border-white/5">
            <h2 className="text-[38px] leading-[1.1] mb-5 font-black tracking-[-1px]">Let's build something exceptional together.</h2>
            <p className="text-[#a3a3ac] mb-[30px] text-[15px]">
              Our team of experts will review your website structure, loading speeds, brand metrics, 
              and organic rankings before our call to ensure you leave with maximum value.
            </p>
            <ul className="grid gap-4 list-none p-0">
              <li className="flex gap-3 text-[#e4e4e7] font-bold text-[15px] items-center before:content-['✓'] before:text-[#e31313] before:font-black before:text-lg">Detailed PDF Roadmap</li>
              <li className="flex gap-3 text-[#e4e4e7] font-bold text-[15px] items-center before:content-['✓'] before:text-[#e31313] before:font-black before:text-lg">Competitive Gap Review</li>
              <li className="flex gap-3 text-[#e4e4e7] font-bold text-[15px] items-center before:content-['✓'] before:text-[#e31313] before:font-black before:text-lg">Tech Stack Audit</li>
              <li className="flex gap-3 text-[#e4e4e7] font-bold text-[15px] items-center before:content-['✓'] before:text-[#e31313] before:font-black before:text-lg">1-on-1 Live Developer Time</li>
            </ul>
          </div>

          <div>
            {!isHydrated || loading ? (
              <div className="flex min-h-[380px] items-center justify-center bg-white rounded-[28px] border border-gray-200 shadow-[0_25px_60px_-12px_rgba(15,15,17,0.12)] w-full">
                <div className="font-bold text-gray-500 flex items-center gap-3 text-[15px]">
                  <svg className="animate-spin w-5 h-5 text-[#e31313] mr-2" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(227, 19, 19, 0.1)" strokeWidth="4" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading Booking Details...</span>
                </div>
              </div>
            ) : success && bookingDetails ? (
              <div className="bg-white border-2 border-green-500 rounded-[28px] p-6 sm:p-10 lg:py-[50px] lg:px-[40px] text-center shadow-[0_25px_60px_-12px_rgba(15,15,17,0.12)] transform transition-transform duration-300 scale-100">
                <div className="w-[72px] h-[72px] bg-green-100 text-green-500 rounded-full grid place-items-center mx-auto mb-6 text-[32px] font-black shadow-[0_4px_12px_rgba(34,197,94,0.15)]">✓</div>
                <h2 className="text-[28px] font-black text-[#0f0f11] mb-3">Consultation Booked!</h2>
                <p className="text-gray-500 text-base mb-6 leading-relaxed">
                  Thank you, <strong>{bookingDetails.name}</strong>. We have received your requirements 
                  and scheduled your consultation details. We will email you at <strong>{bookingDetails.email}</strong> to finalize.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-left grid gap-2.5">
                  <div className="flex justify-between text-sm border-b border-black/5 pb-2">
                    <span className="font-semibold text-gray-500">Requested Service</span>
                    <span className="font-bold text-[#0f0f11]">{bookingDetails.service}</span>
                  </div>
                  {bookingDetails.date && (
                    <div className="flex justify-between text-sm border-b border-black/5 pb-2">
                      <span className="font-semibold text-gray-500">Preferred Date</span>
                      <span className="font-bold text-[#0f0f11]">{new Date(bookingDetails.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-500">Preferred Time</span>
                    <span className="font-bold text-[#0f0f11]">{bookingDetails.time}</span>
                  </div>
                </div>
                <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-bold leading-relaxed">
                  Your consultation strategy call has been locked in. Our lead engineer and design partner are analyzing your domain details to build your roadmap.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-[28px] p-6 sm:p-10 shadow-[0_25px_60px_-12px_rgba(15,15,17,0.12)]">
                <h3 className="text-[24px] font-extrabold mb-6">Request Details</h3>
                
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 py-3 px-4 rounded-xl mb-5 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block font-bold mb-2 text-sm text-[#0f0f11]">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className={`w-full border rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)] ${errors.name ? 'border-[#e31313]' : 'border-gray-300'}`}
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && <p className="text-[#e31313] text-xs font-bold mt-1.5 flex items-center gap-1 opacity-100 transition-opacity duration-200">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block font-bold mb-2 text-sm text-[#0f0f11]">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className={`w-full border rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)] ${errors.email ? 'border-[#e31313]' : 'border-gray-300'}`}
                      placeholder="e.g. john@company.com"
                    />
                    {errors.email && <p className="text-[#e31313] text-xs font-bold mt-1.5 flex items-center gap-1 opacity-100 transition-opacity duration-200">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-bold mb-2 text-sm text-[#0f0f11]">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)]"
                      placeholder="e.g. +1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block font-bold mb-2 text-sm text-[#0f0f11]">Company / Brand Name</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)]"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="website" className="block font-bold mb-2 text-sm text-[#0f0f11]">Website URL *</label>
                    <input 
                      type="text" 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      className={`w-full border rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)] ${errors.website ? 'border-[#e31313]' : 'border-gray-300'}`}
                      placeholder="e.g. www.acme.com"
                    />
                    {errors.website && <p className="text-[#e31313] text-xs font-bold mt-1.5 flex items-center gap-1 opacity-100 transition-opacity duration-200">{errors.website}</p>}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block font-bold mb-2 text-sm text-[#0f0f11]">Industry</label>
                    <input 
                      type="text" 
                      id="industry" 
                      name="industry" 
                      value={formData.industry} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)]"
                      placeholder="e.g. E-commerce, SaaS"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block font-bold mb-2 text-sm text-[#0f0f11]">Core Service Needed *</label>
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
                    {errors.service && <p className="text-[#e31313] text-xs font-bold mt-1.5 flex items-center gap-1 opacity-100 transition-opacity duration-200">{errors.service}</p>}
                  </div>

                  <div>
                    <label htmlFor="budget" className="block font-bold mb-2 text-sm text-[#0f0f11]">Target Budget</label>
                    <SingleSelectDropdown
                      value={formData.budget}
                      options={BUDGET_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, budget: val }))}
                      placeholder="Select budget..."
                    />
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block font-bold mb-2 text-sm text-[#0f0f11]">Timeline</label>
                    <SingleSelectDropdown
                      value={formData.timeline}
                      options={TIMELINE_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, timeline: val }))}
                      placeholder="Select timeline..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="goals" className="block font-bold mb-2 text-sm text-[#0f0f11]">Main Business Goals *</label>
                    <textarea 
                      id="goals" 
                      name="goals" 
                      value={formData.goals} 
                      onChange={handleInputChange} 
                      className={`w-full min-h-[110px] resize-y border rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)] ${errors.goals ? 'border-[#e31313]' : 'border-gray-300'}`}
                      placeholder="What are you hoping to achieve with this project? (e.g. increase leads by 50%, improve checkout conversion)"
                    ></textarea>
                    {errors.goals && <p className="text-[#e31313] text-xs font-bold mt-1.5 flex items-center gap-1 opacity-100 transition-opacity duration-200">{errors.goals}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="challenges" className="block font-bold mb-2 text-sm text-[#0f0f11]">Technical / Design Challenges</label>
                    <textarea 
                      id="challenges" 
                      name="challenges" 
                      value={formData.challenges} 
                      onChange={handleInputChange} 
                      className="w-full min-h-[110px] resize-y border border-gray-300 rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)]"
                      placeholder="Are there specific roadblocks you are facing? (e.g. slow loading speeds, high mobile bounce rates)"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="preferred_date" className="block font-bold mb-2 text-sm text-[#0f0f11]">Preferred Date</label>
                    <input 
                      type="date" 
                      id="preferred_date" 
                      name="preferred_date" 
                      value={formData.preferred_date} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-xl py-3.5 px-4 font-inherit outline-none bg-white text-[#0f0f11] transition-all duration-200 text-[15px] focus:border-[#e31313] focus:shadow-[0_0_0_4px_rgba(227,19,19,0.15)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferred_time" className="block font-bold mb-2 text-sm text-[#0f0f11]">Preferred Time of Day</label>
                    <SingleSelectDropdown
                      value={formData.preferred_time}
                      options={TIME_OPTIONS}
                      onChange={(val) => setFormData(prev => ({ ...prev, preferred_time: val }))}
                      placeholder="Select preferred time..."
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting || loading} className="w-full border-0 bg-gradient-to-br from-[#e31313] to-[#ff4b4b] text-white py-4 px-6 rounded-xl font-extrabold text-base cursor-pointer mt-4 shadow-[0_6px_20px_rgba(227,19,19,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(227,19,19,0.35)] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
                  {submitting ? 'Booking Consultation...' : 'Confirm Consultation Booking'}
                </button>
                
                <p className="text-gray-500 text-[13px] text-center mt-4 leading-relaxed">
                  By clicking above, you agree to our privacy policy. We will prepare your website 
                  metrics checklist prior to our strategy call.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121214] text-white py-10 text-center border-t border-white/5">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <p className="text-[#a1a1aa] text-sm">&copy; {new Date().getFullYear()} Megamind Studios. All rights reserved. Strategic audits for high-growth brands.</p>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-gray-500">
        <div>Loading consultation details...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}