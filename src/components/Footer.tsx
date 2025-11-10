// src/compoenets/Footer.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const socialLinks = [
    {
      icon: <FontAwesomeIcon icon={faGithub} />,
      href: "https://github.com/PARKSEHYUNN",
    },
  ];

  return (
    <footer className="bg-gray-100 pt-8 py-8 bg-color-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                aria-label={`Visit my ${link.href}`}
              >
                <span className="text-2xl">{link.icon}</span>
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MapleBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
