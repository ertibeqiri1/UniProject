import Link from 'next/link'
import { GraduationCap, Github, Mail } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Browse Courses', href: '/courses' },
    { label: 'About EduFlow',  href: '/about' },
    { label: 'Contact Us',     href: '/contact' },
  ],
  Account: [
    { label: 'Sign In',    href: '/auth/signin' },
    { label: 'Register',   href: '/auth/register' },
    { label: 'Dashboard',  href: '/dashboard' },
    { label: 'Wishlist',   href: '/wishlist' },
  ],
}

const team = ['Erti Beqiri', 'Orges Shala', 'Enis Mamusha', 'Eriona Kolica']

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Edu<span className="text-primary-500">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              An online learning platform where you can discover, enroll, and master new skills taught by expert instructors.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/ertibeqiri1/UniProject"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EduFlow. Built for Client-Side Web Development course.
          </p>
          <p className="text-xs text-gray-500">
            {team.join(' · ')}
          </p>
        </div>
      </div>
    </footer>
  )
}
