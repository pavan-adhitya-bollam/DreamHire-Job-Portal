import nodemailer from 'nodemailer';

// Create transporter using universal SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Allow connections to any domain
    }
  });
};

// Check if email is properly configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && 
         process.env.EMAIL_PASS && 
         process.env.EMAIL_USER !== 'your-gmail-address@gmail.com' && 
         process.env.EMAIL_PASS !== 'your-16-character-app-password';
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    // Check if email is properly configured
    if (!isEmailConfigured()) {
      console.error('Email service not properly configured');
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Job Portal - Email Verification OTP',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for registering with Job Portal! To complete your registration, please use the following OTP (One-Time Password) to verify your email address:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your OTP Code:</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; text-decoration: none;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>· This OTP will expire in <strong>10 minutes</strong>
              <br>· Do not share this OTP with anyone
              <br>· If you didn't request this OTP, please ignore this email
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}: ${otp}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Generate and send OTP
export const generateAndSendOTP = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  const emailSent = await sendOTPEmail(email, otp);
  
  if (emailSent) {
    return { otp, expiresAt };
  }
  return null;
};

// Send application status email (accept/reject notifications)
export const sendApplicationStatusEmail = async (userEmail, userName, jobTitle, companyName, status) => {
  try {
    console.log('🔧 Application Status Email Debug:');
    console.log('User Email:', userEmail);
    console.log('User Name:', userName);
    console.log('Job Title:', jobTitle);
    console.log('Company:', companyName);
    console.log('Status:', status);
    console.log('isEmailConfigured():', isEmailConfigured());
    
    // Check if email is properly configured
    if (!isEmailConfigured()) {
      console.log('Email not configured - using test mode');
      console.log(`Test status email for ${userName}: Application ${status} for ${jobTitle} at ${companyName}`);
      return true;
    }

    const transporter = createTransporter();

    let subject, message, ctaColor, ctaText;

    if (status === 'accepted') {
      subject = `Congratulations! Your Application for ${jobTitle} at ${companyName} has been Approved`;
      message = `Great news! Your application has been approved by the hiring team.`;
      ctaColor = '#10b981';
      ctaText = 'View Application Status';
    } else if (status === 'rejected') {
      subject = `Update on Your Application for ${jobTitle} at ${companyName}`;
      message = `Thank you for your interest. We have decided to move forward with other candidates.`;
      ctaColor = '#6b7280';
      ctaText = 'Find More Opportunities';
    } else {
      return false; // Invalid status
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Application Status Update</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Dear ${userName},</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              ${message}
            </p>
            
            <div style="background: white; border: 2px dashed #e5e7eb; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 15px;">Application Details:</p>
              <div style="font-size: 16px; color: #374151;">
                <p><strong>Position:</strong> ${jobTitle}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Status:</strong> 
                  <span style="color: ${status === 'accepted' ? '#10b981' : '#ef4444'}; font-weight: bold;">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/profile" 
                 style="display: inline-block; background: ${ctaColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                ${ctaText}
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>• You can view all your applications in your profile
              <br>• Keep your profile information updated
              <br>• ${status === 'accepted' ? 'The hiring team will contact you soon with next steps' : 'Keep applying for more opportunities'}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application status email sent to ${userEmail}: ${status} for ${jobTitle} at ${companyName}`);
    return true;
  } catch (error) {
    console.error('Error sending application status email:', error);
    return false;
  }
};
export const sendJobApplicationEmail = async (userEmail, userName, jobTitle, companyName) => {
  try {
    console.log('🔧 Email Debug - Environment variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('isEmailConfigured():', isEmailConfigured());
    
    // Check if email is properly configured
    if (!isEmailConfigured()) {
      console.log('Email not configured - using test mode');
      console.log(`Test application confirmation for ${userName}: Applied for ${jobTitle} at ${companyName}`);
      return true;
    }

    const mailOptions = {
      from: 'job-portal@ethereal.email',
      to: userEmail,
      subject: `Job Portal - Application Confirmation for ${jobTitle} at ${companyName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Application Confirmation</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Dear ${userName},</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. 
              We have successfully received your application and resume.
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Our team will review your resume and profile carefully. Once we complete our review process, 
              we will inform you about the next steps in the hiring process.
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 10px;">Application Details:</p>
              <div style="font-size: 16px; color: #374151;">
                <p><strong>Position:</strong> ${jobTitle}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Status:</strong> Under Review</p>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>• Keep your contact information updated in your profile
              <br>• We will contact you via email regarding next steps
              <br>• This confirmation serves as receipt of your application
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application confirmation email sent to ${userEmail} for ${jobTitle} at ${companyName}`);
    return true;
  } catch (error) {
    console.error('Error sending application confirmation email:', error);
    return false;
  }
};
