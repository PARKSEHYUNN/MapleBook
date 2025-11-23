// src/components/layout/Footer.tsx
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  const socialLinks = [
    {
      icon: <FontAwesomeIcon icon={faGithub} />,
      href: 'https://github.com/PARKSEHYUNN',
    },
  ];

  return (
    <footer className="bg-color-800 bg-gray-100 py-8 pt-8 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors duration-200 hover:text-gray-900"
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
