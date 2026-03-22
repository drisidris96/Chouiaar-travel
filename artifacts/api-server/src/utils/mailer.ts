import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const bannerPath = process.env.NODE_ENV === "production"
  ? path.resolve(__dirname, "../../travel-agency/dist/public/images/email-banner.jpg")
  : path.resolve(__dirname, "../../travel-agency/public/images/email-banner.jpg");

function buildEmailHTML(options: {
  name: string;
  bodyText: string;
  codeLabel: string;
  code: string;
  codeColor: string;
  footerText: string;
}) {
  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f5; padding: 0;">
      <!-- Banner Header -->
      <div style="border-radius: 16px 16px 0 0; overflow: hidden;">
        <img src="cid:banner" alt="${agencyName.ar}" style="width: 100%; height: auto; display: block;" />
      </div>

      <!-- Content -->
      <div style="background: white; padding: 30px 30px 20px; margin: 0;">
        <h2 style="color: #1B3A5C; margin: 0 0 16px; font-size: 22px;">مرحباً ${options.name} 👋</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.9; margin: 0 0 20px;">${options.bodyText}</p>

        <!-- Code Box -->
        <div style="background: ${options.codeColor}; color: white; text-align: center; padding: 22px 20px; border-radius: 14px; margin: 0 0 20px;">
          <p style="margin: 0 0 6px; font-size: 14px; opacity: 0.9;">${options.codeLabel}</p>
          <h1 style="margin: 0; font-size: 42px; letter-spacing: 10px; font-weight: bold;">${options.code}</h1>
        </div>

        <p style="color: #888; font-size: 14px; margin: 0 0 20px;">⚠️ هذا الرمز صالح لمدة 30 دقيقة فقط.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 16px;">
        <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0 0 6px;">${options.footerText}</p>
      </div>

      <!-- Footer -->
      <div style="background: #1B3A5C; padding: 16px; text-align: center; border-radius: 0 0 16px 16px;">
        <p style="color: #C8A54C; font-size: 14px; margin: 0; font-weight: bold;">${agencyName.ar}</p>
        <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 4px 0 0;">CHOUIAAR TRAVEL AGENCY</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 6px 0 0;">📞 +213 74 71 84 96 &nbsp;&nbsp; 📧 chouiaartravelagency@gmail.com</p>
      </div>
    </div>
  `;
}

export async function sendVerificationEmail(to: string, code: string, name: string) {
  const html = buildEmailHTML({
    name,
    bodyText: "شكراً لتسجيلك في وكالة شويعر للسياحة والأسفار. لتفعيل حسابك، استخدم الرمز التالي:",
    codeLabel: "رمز التحقق",
    code,
    codeColor: "linear-gradient(135deg, #C8A54C 0%, #d4af37 100%)",
    footerText: "إذا لم تقم بإنشاء حساب، تجاهل هذه الرسالة.",
  });

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `رمز التحقق - ${agencyName.ar}`,
    html,
    attachments: [{
      filename: "banner.jpg",
      path: bannerPath,
      cid: "banner",
    }],
  });
}

export async function sendPasswordResetEmail(to: string, code: string, name: string) {
  const html = buildEmailHTML({
    name,
    bodyText: "لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. استخدم الرمز التالي:",
    codeLabel: "رمز إعادة تعيين كلمة المرور",
    code,
    codeColor: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
    footerText: "إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.",
  });

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `إعادة تعيين كلمة المرور - ${agencyName.ar}`,
    html,
    attachments: [{
      filename: "banner.jpg",
      path: bannerPath,
      cid: "banner",
    }],
  });
}

export async function sendEmailChangeVerification(to: string, code: string, name: string) {
  const html = buildEmailHTML({
    name,
    bodyText: "لقد طلبت تغيير بريدك الإلكتروني. لتأكيد البريد الجديد، استخدم الرمز التالي:",
    codeLabel: "رمز تأكيد البريد الجديد",
    code,
    codeColor: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
    footerText: "إذا لم تطلب تغيير البريد، تجاهل هذه الرسالة.",
  });

  await transporter.sendMail({
    from: `"${agencyName.ar}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `تأكيد البريد الإلكتروني الجديد - ${agencyName.ar}`,
    html,
    attachments: [{
      filename: "banner.jpg",
      path: bannerPath,
      cid: "banner",
    }],
  });
}
