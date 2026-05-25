import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reportId = searchParams.get('report_id')
    const leadId = searchParams.get('lead_id')

    if (!reportId && !leadId) {
      return NextResponse.json({ error: 'report_id or lead_id is required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('audit_reports')
      .select('report_content, lead_id, lead:leads(*)')

    if (reportId) {
      query = query.eq('id', reportId)
    } else if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data: report, error } = await query.maybeSingle()

    if (error) {
      console.error('Database error fetching scores:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!report) {
      // If we don't find a report but we have a lead_id, let's fetch just the lead details
      if (leadId) {
        const { data: lead, error: leadError } = await supabaseAdmin
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .maybeSingle()

        if (!leadError && lead) {
          const leadObj = Array.isArray(lead) ? lead[0] : lead

          // Check if consultation exists
          const { data: consultation } = await supabaseAdmin
            .from('consultations')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          return NextResponse.json({
            success: true,
            hasReport: false,
            lead: {
              name: leadObj.name,
              email: leadObj.email,
              phone: leadObj.phone || '',
              website_url: leadObj.website_url,
              business_type: leadObj.business_type || '',
            },
            scores: {
              desktopScore: null,
              mobileScore: null,
              seoScore: null
            },
            hasConsultation: !!consultation,
            consultation: consultation ? {
              name: leadObj.name,
              email: leadObj.email,
              service: consultation.service,
              date: consultation.preferred_date,
              time: consultation.preferred_time,
            } : null
          })
        }
      }
      return NextResponse.json({ error: 'Report or lead not found' }, { status: 404 })
    }

    const reportContent = report.report_content as any
    const rawLead = report.lead as any
    const lead = Array.isArray(rawLead) ? rawLead[0] : rawLead

    const overallScore = reportContent?.overall_score ?? 80

    // Extract individual scores from report_content
    const desktopScore = reportContent?.performance?.desktop_score ?? overallScore
    const mobileScore = reportContent?.performance?.mobile_score ?? overallScore
    const seoScore = reportContent?.seo?.score ?? overallScore

    // Check if consultation exists
    const finalLeadId = leadId || lead?.id
    let consultation = null
    if (finalLeadId) {
      const { data: consultData } = await supabaseAdmin
        .from('consultations')
        .select('*')
        .eq('lead_id', finalLeadId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (consultData) {
        consultation = consultData
      }
    }

    return NextResponse.json({
      success: true,
      hasReport: true,
      lead: {
        name: lead?.name || '',
        email: lead?.email || '',
        phone: lead?.phone || '',
        website_url: lead?.website_url || '',
        business_type: lead?.business_type || '',
      },
      scores: {
        desktopScore,
        mobileScore,
        seoScore,
        overall: overallScore
      },
      hasConsultation: !!consultation,
      consultation: consultation ? {
        name: lead?.name || '',
        email: lead?.email || '',
        service: consultation.service,
        date: consultation.preferred_date,
        time: consultation.preferred_time,
      } : null
    })
  } catch (error) {
    console.error('Error in get-scores API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
