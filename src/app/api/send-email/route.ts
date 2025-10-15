import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_CONFIG } from "@/config/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, type } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // For contact forms, require name and email
    if (type !== "product-inquiry") {
      if (!name || !email) {
        return NextResponse.json(
          {
            success: false,
            error: "Name and email are required for contact form",
          },
          { status: 400 }
        );
      }
    }

    // Validate email format if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isValidEmail = email && emailRegex.test(email);

    // Format email based on type
    let htmlContent = "";
    let textContent = "";
    let emailSubject = subject || "New Contact Form Submission";

    if (type === "product-inquiry") {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 35px 25px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.1); }
            .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
            .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
            .product-badge { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); }
            .section { margin-bottom: 30px; }
            .section-title { color: #1e40af; font-size: 18px; font-weight: 600; margin-bottom: 15px; border-bottom: 3px solid #3b82f6; padding-bottom: 8px; display: inline-block; }
            .info-row { margin: 12px 0; padding: 15px 18px; background: linear-gradient(to right, #eff6ff 0%, #f9fafb 100%); border-left: 4px solid #3b82f6; border-radius: 6px; transition: transform 0.2s; }
            .info-label { font-weight: 600; color: #4b5563; margin-bottom: 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { color: #1f2937; font-size: 15px; }
            .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 15px; }
            .option-item { background: #fff; padding: 12px 15px; border: 2px solid #dbeafe; border-radius: 8px; font-size: 14px; color: #1e40af; font-weight: 500; transition: all 0.2s; }
            .message-box { background: linear-gradient(to bottom, #f0f9ff 0%, #f9fafb 100%); padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe; margin-top: 12px; color: #1f2937; font-size: 15px; line-height: 1.7; }
            .footer { background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%); padding: 25px; text-align: center; font-size: 13px; color: #6b7280; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb; }
            .highlight { color: #2563eb; font-weight: 600; font-size: 16px; }
            a { color: #2563eb; text-decoration: none; transition: color 0.2s; }
            a:hover { color: #1e40af; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Product Inquiry</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 15px;">Polygen Website</p>
            </div>
            <div class="content">
              <div class="product-badge">📦 Product Inquiry</div>

              <div class="section">
                <div class="section-title">Product Information</div>
                <div class="info-row">
                  <div class="info-label">Product Name:</div>
                  <div class="info-value highlight">${
                    body.productName || "Not specified"
                  }</div>
                </div>
              </div>

              ${
                body.selectedOptions
                  ? `
              <div class="section">
                <div class="section-title">Selected Options</div>
                <div class="options-grid">
                  ${body.selectedOptions
                    .split("<br />")
                    .map(
                      (option: string) =>
                        `<div class="option-item">✓ ${option}</div>`
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }

              <div class="section">
                <div class="section-title">Customer Message</div>
                <div class="message-box">${
                  message || "No message provided"
                }</div>
              </div>

              ${
                email
                  ? `
              <div class="section">
                <div class="section-title">Contact Information</div>
                <div class="info-row">
                  <div class="info-label">📧 Email Address:</div>
                  <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                </div>
              </div>
              `
                  : ""
              }
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0; font-weight: 500;">📩 This inquiry was submitted from <strong>Polygen Website</strong></p>
              <p style="margin: 0; color: #9ca3af;">Please respond to the customer as soon as possible.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      emailSubject = `🔔 Product Inquiry: ${
        body.productName || "Unknown Product"
      }`;

      // Plain text version for better deliverability
      textContent = `
New Product Inquiry from Polygen Website

Product: ${body.productName || "Not specified"}
${
  body.selectedOptions
    ? `\nSelected Options:\n${body.selectedOptions.replace(/<br \/>/g, "\n")}`
    : ""
}

Customer Message:
${message || "No message provided"}
${email ? `\nContact Email: ${email}` : ""}

---
This inquiry was submitted from the Polygen Website.
      `.trim();
    } else {
      // Contact form
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 35px 25px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.1); }
            .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
            .content { background: #ffffff; padding: 35px 30px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
            .contact-badge { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); }
            .section { margin-bottom: 30px; }
            .section-title { color: #1e40af; font-size: 18px; font-weight: 600; margin-bottom: 15px; border-bottom: 3px solid #3b82f6; padding-bottom: 8px; display: inline-block; }
            .info-row { margin: 12px 0; padding: 15px 18px; background: linear-gradient(to right, #eff6ff 0%, #f9fafb 100%); border-left: 4px solid #3b82f6; border-radius: 6px; transition: transform 0.2s; }
            .info-label { font-weight: 600; color: #4b5563; margin-bottom: 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { color: #1f2937; font-size: 15px; }
            .message-box { background: linear-gradient(to bottom, #f0f9ff 0%, #f9fafb 100%); padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe; margin-top: 12px; white-space: pre-wrap; color: #1f2937; font-size: 15px; line-height: 1.7; }
            .footer { background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%); padding: 25px; text-align: center; font-size: 13px; color: #6b7280; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb; }
            a { color: #2563eb; text-decoration: none; transition: color 0.2s; }
            a:hover { color: #1e40af; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Message</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 15px;">Polygen Website</p>
            </div>
            <div class="content">
              <div class="contact-badge">💬 Contact Form Submission</div>

              <div class="section">
                <div class="section-title">Contact Information</div>
                <div class="info-row">
                  <div class="info-label">👤 Name:</div>
                  <div class="info-value">${name || "Not provided"}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">📧 Email:</div>
                  <div class="info-value"><a href="mailto:${email}">${
        email || "Not provided"
      }</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">📋 Subject:</div>
                  <div class="info-value">${subject || "No subject"}</div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Message</div>
                <div class="message-box">${
                  message || "No message provided"
                }</div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0; font-weight: 500;">📩 This message was sent from the <strong>Polygen Website</strong> contact form</p>
              <p style="margin: 0; color: #9ca3af;">Please respond to the customer as soon as possible.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      emailSubject = subject || "📧 New Contact Form Message";

      // Plain text version for better deliverability
      textContent = `
New Contact Message from Polygen Website

Contact Information:
Name: ${name || "Not provided"}
Email: ${email || "Not provided"}
Subject: ${subject || "No subject"}

Message:
${message || "No message provided"}

---
This message was sent from the Polygen Website contact form.
      `.trim();
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: EMAIL_CONFIG.fromEmail,
      to: [EMAIL_CONFIG.recipientEmail],
      cc: EMAIL_CONFIG.ccEmails.length > 0 ? EMAIL_CONFIG.ccEmails : undefined,
      subject: emailSubject,
      html: htmlContent,
      text: textContent, // Add plain text fallback
      replyTo: isValidEmail ? email : undefined, // Only set replyTo if email is valid
      headers: {
        "X-Entity-Ref-ID": `${Date.now()}-${type || "contact"}`,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
