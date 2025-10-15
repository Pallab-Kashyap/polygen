interface MailData {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  type?: "contact" | "product-inquiry";
  productName?: string;
  selectedOptions?: string;
  [key: string]: any;
}

async function sendMail(data: MailData) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to send email");
  }

  return result;
}

export default sendMail;
