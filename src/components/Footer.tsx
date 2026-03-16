'use client'

import { Linkedin } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import siteContent from '@/content/site.json'

const navLinks = [
  { href: '#features', label: { en: 'Benefits', es: 'Beneficios' } },
  { href: '#pilot', label: { en: 'Pilot Program', es: 'Programa Piloto' } },
  { href: '#faq', label: { en: 'FAQ', es: 'FAQ' } },
  { href: '#about', label: { en: 'About', es: 'Acerca' } },
  { href: '#contact', label: { en: 'Contact', es: 'Contacto' } },
]

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/company/algae-renewable', label: 'LinkedIn' },
]

const legalLinks = [
  { href: '#privacy', label: { en: 'Privacy Policy', es: 'Política de Privacidad' } },
  { href: '#terms', label: { en: 'Terms of Service', es: 'Términos de Servicio' } },
]

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-border/20" style={{ backgroundColor: "#063D57" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Image
                src="/logo-white.png"
                alt={siteContent.brand.name}
                width={120}
                height={40}
                className="h-10 w-auto dark:invert-0 invert"
              />
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed" style={{ color: "#729DB9" }}>
              {t(siteContent.brand.description)}
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: "#729DB9" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#47AECC"; (e.currentTarget as HTMLAnchorElement).style.background = "#47AECC14"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#729DB9"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "#47AECC" }}
            >
              {t({ en: 'Navigation', es: 'Navegación' })}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#729DB9" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#CCE6EA")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#729DB9")}
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "#47AECC" }}
            >
              {t({ en: 'Legal', es: 'Legal' })}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#729DB9" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#CCE6EA")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#729DB9")}
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8" style={{ borderTop: "1px solid #47AECC1a" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "#47AECC66" }}>
              {t({
                en: `© ${currentYear} ${siteContent.brand.name}. All rights reserved.`,
                es: `© ${currentYear} ${siteContent.brand.name}. Todos los derechos reservados.`,
              })}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: "#47AECC40" }}>
              {t({
                en: 'Turning sargassum into a resource.',
                es: 'Convirtiendo el sargazo en un recurso.',
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
