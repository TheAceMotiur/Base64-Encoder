import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Base64 Encoder/Decoder",
  description: "Privacy policy for base64-encoder.com - how we handle your data and protect your privacy",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
