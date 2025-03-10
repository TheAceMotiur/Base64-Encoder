export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Introduction</h2>
        <p>
          At base64-encoder.com, we respect your privacy and are committed to protecting your personal data. 
          This privacy policy explains how we handle any information when you use our website.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Information We Process</h2>
        <p>
          <strong>No Storage of Uploaded Content:</strong> Our Base64 encoder/decoder processes all data directly 
          in your browser. We do not store, collect, or transmit any text or images that you encode or decode.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Usage Data</h2>
        <p>
          We may collect anonymous usage statistics to help improve our service, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring website</li>
          <li>Time and date of your visit</li>
          <li>Pages visited</li>
        </ul>
        <p>
          This information does not identify you personally and is used solely for analytical purposes to enhance 
          user experience and website performance.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Cookies</h2>
        <p>
          Our website may use cookies to enhance your browsing experience. You can control cookies through your 
          browser settings. Disabling cookies may limit some functionality of the website.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
        <p>
          We may use third-party analytics services (such as Google Analytics) to help understand how users engage 
          with our website. These services may use cookies and similar technologies to collect information about your 
          use of the website.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Data Security</h2>
        <p>
          All encoding and decoding operations are performed locally in your browser. Your data is never sent to our servers.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Children's Privacy</h2>
        <p>
          Our service is not directed to individuals under the age of 13. We do not knowingly collect personal 
          information from children under 13.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page with an updated revision date.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: privacy@base64-encoder.com
        </p>
      </div>
    </div>
  );
}
