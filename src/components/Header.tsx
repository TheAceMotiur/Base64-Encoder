import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-blue-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2" />
              <path d="M9 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4" />
              <path d="M8 12h8" />
              <path d="M12 16v-8" />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Base64 Encoder</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">base64-encoder.com</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              Home
            </Link>
            <Link href="/privacy-policy" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
