import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Base64 Encoder/Decoder",
  description: "Privacy policy for base64-encoder.com - how we handle your data and protect your privacy while using our Base64 conversion tool",
  alternates: {
    canonical: "https://base64-encoder.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - Base64 Encoder/Decoder",
    description: "Privacy policy for base64-encoder.com - how we handle your data and protect your privacy",
    url: "https://base64-encoder.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
