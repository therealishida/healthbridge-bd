import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/consultations — save a new form submission
export async function POST(req: NextRequest) {
  try {
    const { 
      name, phone, whatsapp, email, dob, gender, specialty, condition, 
      destination, hospital_pref, medical_reports, passport_copy, 
      assistance, message, consent_accuracy, consent_processing, consent_terms 
    } = await req.json();

    if (!name || !phone || !email || !dob || !gender || !specialty || !condition || !medical_reports || !passport_copy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save text details to database (skip large base64 files to avoid bloat)
    await sql`
      INSERT INTO consultations (
        name, phone, whatsapp, email, dob, gender, specialty, condition, 
        destination, hospital_pref, medical_reports, passport_copy, 
        assistance, message, consent_accuracy, consent_processing, consent_terms
      )
      VALUES (
        ${name}, ${phone}, ${whatsapp ?? ''}, ${email}, ${dob}, ${gender}, ${specialty}, ${condition}, 
        ${destination ?? ''}, ${hospital_pref ?? ''}, NULL, NULL, 
        ${JSON.stringify(assistance ?? [])}, ${message ?? ''}, ${consent_accuracy}, ${consent_processing}, ${consent_terms}
      )
    `;

    // 2. Send Email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.NOTIFICATION_EMAIL || 'info@healthbridge-tgv.com';

    if (resendApiKey) {
      // Extract pure base64 content from data URIs
      const reportB64 = medical_reports.split(',')[1] || medical_reports;
      const passportB64 = passport_copy.split(',')[1] || passport_copy;

      const htmlContent = `
        <h2>New Patient Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>DOB:</strong> ${dob} | <strong>Gender:</strong> ${gender}</p>
        <p><strong>Phone:</strong> ${phone} | <strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <h3>Medical Information</h3>
        <p><strong>Specialty:</strong> ${specialty}</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Preferred Destination:</strong> ${destination || 'None'}</p>
        <p><strong>Preferred Hospital:</strong> ${hospital_pref || 'None'}</p>
        <hr/>
        <h3>Assistance Required</h3>
        <p>${assistance?.length ? assistance.join(', ') : 'None'}</p>
        <hr/>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `;

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [toEmail],
          subject: `New Consultation Request: ${name}`,
          html: htmlContent,
          attachments: [
            {
              filename: 'Medical_Reports.pdf',
              content: reportB64
            },
            {
              filename: 'Passport_Copy.pdf',
              content: passportB64
            }
          ]
        })
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Resend API Error:", errText);
        throw new Error("Failed to send email");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Consultation insert error:', err);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}

// GET /api/consultations — list all submissions (admin only)
export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM consultations ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Consultation fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
