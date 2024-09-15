import { EmailConfig } from "next-auth/providers";

interface SendVerificationRequestParams {
  to: string;
  provider: EmailConfig;
  url: string;
}

interface EmailParams {
  url: string;
  host: string;
}

export const sendVerificationRequest = async ({
  identifier,
  provider,
  url,
}: Parameters<EmailConfig["sendVerificationRequest"]>[0]) => {
  const { host } = new URL(url);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to: identifier,
      subject: `Sign in to Leoline`,
      html: html({ url, host }),
      text: text({ url, host }),
    }),
  });

  if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()));
};

const html = ({ url, host }: EmailParams) => {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#e87414";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <br />
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to Leoline
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
  <br />
</body>
`;
};

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ url }: EmailParams) => {
  return `Sign in to Sign in to Leoline\n${url}\n\n`;
};
