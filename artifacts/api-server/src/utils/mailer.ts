import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const agencyName = {
  ar: "وكالة شويعر للسياحة والأسفار",
  fr: "Agence Chouiaar de Tourisme et Voyages",
  en: "Chouiaar Travel Agency",
};

export async function sendVerificationEmail(to: string, code: string, name: string) {
  const html = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1B3A5C 0%, #2c5282 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${agencyName.ar}</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">CHOUIAAR TRAVEL AGENCY</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1B3A5C; margin-top: 0;">مرحباً ${name} 👋</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.8;">شكراً لتسجيلك في وكالة شويعر للسياحة والأسفار. لتفعيل حسابك، استخدم الرمز التالي:</p>
        <div style="background: linear-gradient(135deg, #C8A54C 0%, #d4af37 100%); color: white; text-align: center; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 5px; font-size: 14px;">رمز التحقق</p>
          <h1 style="margin: 0; font-size: 40px; letter-spacing: 8px; font-weight: bold;">${code}</h1>
        </div>
        <p style="color: #888; font-size: 14px;">⚠️ هذا الرمز صالح لمدة 30 دقيقة فقط.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">إذا لم تقم بإنشاء حساب، تجاهل هذه الرسالة.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `رمز التحقق - ${agencyName.ar}`,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, code: string, name: string) {
  const html = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1B3A5C 0%, #2c5282 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${agencyName.ar}</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">CHOUIAAR TRAVEL AGENCY</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1B3A5C; margin-top: 0;">مرحباً ${name} 👋</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.8;">لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. استخدم الرمز التالي:</p>
        <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: white; text-align: center; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 5px; font-size: 14px;">رمز إعادة تعيين كلمة المرور</p>
          <h1 style="margin: 0; font-size: 40px; letter-spacing: 8px; font-weight: bold;">${code}</h1>
        </div>
        <p style="color: #888; font-size: 14px;">⚠️ هذا الرمز صالح لمدة 30 دقيقة فقط.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `إعادة تعيين كلمة المرور - ${agencyName.ar}`,
    html,
  });
}

export async function sendEmailChangeVerification(to: string, code: string, name: string) {
  const html = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1B3A5C 0%, #2c5282 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${agencyName.ar}</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">CHOUIAAR TRAVEL AGENCY</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1B3A5C; margin-top: 0;">مرحباً ${name} 👋</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.8;">لقد طلبت تغيير بريدك الإلكتروني. لتأكيد البريد الجديد، استخدم الرمز التالي:</p>
        <div style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); color: white; text-align: center; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 5px; font-size: 14px;">رمز تأكيد البريد الجديد</p>
          <h1 style="margin: 0; font-size: 40px; letter-spacing: 8px; font-weight: bold;">${code}</h1>
        </div>
        <p style="color: #888; font-size: 14px;">⚠️ هذا الرمز صالح لمدة 30 دقيقة فقط.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">إذا لم تطلب تغيير البريد، تجاهل هذه الرسالة.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `تأكيد البريد الإلكتروني الجديد - ${agencyName.ar}`,
    html,
  });
}
