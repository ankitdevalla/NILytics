import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

type EmailData = {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(data: EmailData): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_EMAIL_API_KEY;
  
  if (!apiKey) {
    console.error('Mailgun API key is not defined');
    return false;
  }

  const domain = 'sandbox37e5e3c48fc4454c918641f65ac8576c.mailgun.org'; // Updated to correct sandbox domain
  const url = `https://api.mailgun.net/v3/${domain}/messages`;
  
  const formData = new URLSearchParams();
  formData.append('from', data.from || 'NILytics Demo Request <demo@nilytics.com>');
  formData.append('to', data.to);
  formData.append('subject', data.subject);
  formData.append('text', data.text);
  
  if (data.html) {
    formData.append('html', data.html);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error('Mailgun API error:', responseData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 