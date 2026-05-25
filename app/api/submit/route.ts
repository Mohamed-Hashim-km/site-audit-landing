import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      lead_id,
      name,
      email,
      phone,
      company,
      website,
      industry,
      service,
      budget,
      timeline,
      goals,
      challenges,
      preferred_date,
      preferred_time
    } = body

    if (!email || !name || !website || !service || !goals) {
      return NextResponse.json({ error: 'Name, Email, Website URL, Service, and Main Business Goals are required.' }, { status: 400 })
    }

    let finalLeadId = lead_id

    // If finalLeadId is provided, verify it exists. If not, we will check by email + website
    if (finalLeadId) {
      const { data: leadCheck } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('id', finalLeadId)
        .maybeSingle()

      if (!leadCheck) {
        finalLeadId = null
      }
    }

    // If we don't have a verified lead ID, let's find or create one
    if (!finalLeadId) {
      // Clean URL
      let cleanUrl = website.trim()
      if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`

      // Check if lead already exists with the same email and website URL
      const { data: existingLead } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('email', email.trim())
        .eq('website_url', cleanUrl)
        .maybeSingle()

      if (existingLead) {
        const leadObj = Array.isArray(existingLead) ? existingLead[0] : existingLead
        finalLeadId = leadObj.id
      } else {
        // Create new lead
        const { data: newLead, error: createLeadError } = await supabaseAdmin
          .from('leads')
          .insert({
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : null,
            website_url: cleanUrl,
            business_type: company ? company.trim() : null,
            status: 'pending'
          })
          .select()
          .single()

        if (createLeadError || !newLead) {
          console.error('Failed to create lead:', createLeadError)
          return NextResponse.json({ error: 'Failed to create lead record.' }, { status: 500 })
        }

        const leadObj = Array.isArray(newLead) ? newLead[0] : newLead
        finalLeadId = leadObj.id
      }
    } else {
      // If we have a verified lead ID, let's update their details if phone or company was provided
      const updates: Record<string, any> = {}
      if (phone) updates.phone = phone.trim()
      if (company) updates.business_type = company.trim()
      
      if (Object.keys(updates).length > 0) {
        await supabaseAdmin
          .from('leads')
          .update(updates)
          .eq('id', finalLeadId)
      }
    }

    // Create the consultation booking
    const { data: newConsultation, error: createConsultError } = await supabaseAdmin
      .from('consultations')
      .insert({
        lead_id: finalLeadId,
        company: company ? company.trim() : null,
        industry: industry ? industry.trim() : null,
        service: service,
        budget: budget || null,
        timeline: timeline || null,
        goals: goals.trim(),
        challenges: challenges ? challenges.trim() : null,
        preferred_date: preferred_date || null,
        preferred_time: preferred_time || null
      })
      .select()
      .single()

    if (createConsultError || !newConsultation) {
      console.error('Failed to create consultation:', createConsultError)
      return NextResponse.json({ error: 'Failed to book consultation in database.' }, { status: 500 })
    }

    const consultObj = Array.isArray(newConsultation) ? newConsultation[0] : newConsultation

    return NextResponse.json({
      success: true,
      consultation_id: consultObj.id,
      lead_id: finalLeadId
    })
  } catch (error) {
    console.error('Submit consultation error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
