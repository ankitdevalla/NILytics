import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  try {
    const { name, email, institution, phoneNumber, preferredTime, message, subject, isContactForm } = await request.json();
    
    // Use the MAILGUN_API_KEY environment variable
    const apiKey = process.env.MAILGUN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mailgun API key is not configured' },
        { status: 500 }
      );
    }
    
    // Use the MAILGUN_DOMAIN environment variable
    const domain = process.env.MAILGUN_DOMAIN;
    if (!domain) {
      return NextResponse.json(
        { error: 'Mailgun domain is not configured' },
        { status: 500 }
      );
    }
    
    const url = `https://api.mailgun.net/v3/${domain}/messages`;
    
    const formData = new URLSearchParams();
    formData.append('from', 'NILytics <noreply@nilytics.com>');
    // For sandbox domains, you MUST authorize recipient emails in your Mailgun dashboard first
    formData.append('to', 'ankitdevalla.dev@gmail.com');
    
    if (isContactForm) {
      // This is from the contact form
      formData.append('subject', subject || `Contact Form Submission from ${name}`);
      const emailText = `
        New contact form submission:
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject || 'No subject'}
        Message: ${message || 'No message'}
        
        Submitted on: ${new Date().toLocaleString()}
      `;
      formData.append('text', emailText);
    } else {
      // This is a demo request
      formData.append('subject', `New Demo Request from ${name} at ${institution}`);
      const emailText = `
        New demo request details:
        
        Name: ${name}
        Email: ${email}
        Institution: ${institution}
        Phone: ${phoneNumber || 'Not provided'}
        Preferred Time: ${preferredTime || 'Not specified'}
        Message: ${message || 'No message'}
        
        Submitted on: ${new Date().toLocaleString()}
      `;
      formData.append('text', emailText);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mailgun API error:', response.status, errorData);
      return NextResponse.json(
        { 
          error: 'Failed to send email notification',
          details: `Status: ${response.status}, Response: ${errorData}` 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in notification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 