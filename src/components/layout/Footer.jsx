import { MessageCircle, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../../config/site'
import { InstagramIcon, FacebookIcon } from '../shared/SocialIcons'
import WhatsAppButton from '../shared/WhatsAppButton'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer id="footer" className="bg-bronce text-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo className="h-16 w-auto" invertOnDark lazy />
            <p className="font-editorial text-2xl text-champan leading-snug">
              "{SITE_CONFIG.slogan}"
            </p>
            <p className="font-inter text-sm text-crema/70 leading-relaxed">
              {SITE_CONFIG.descripcion}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="font-cinzel text-champan tracking-widest text-sm uppercase mb-2">
              Navegación
            </h4>
            {[
              { label: 'Catálogo', href: '/#catalogo' },
              { label: 'Nuestros Montajes', href: '/#montajes' },
              { label: 'Sobre Nosotros', href: '/#nosotros' },
              { label: 'Testimonios', href: '/#testimonios' },
            ].map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-inter text-sm text-crema/70 hover:text-crema transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="font-cinzel text-champan tracking-widest text-sm uppercase mb-2">
              Contáctanos
            </h4>
            <WhatsAppButton className="flex items-center gap-2 bg-[#25D366] text-white font-inter text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#20ba5a] transition-colors">
              <MessageCircle size={16} />
              WhatsApp
            </WhatsAppButton>
            <div className="flex gap-4 mt-2">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crema/70 hover:text-crema transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={22} />
              </a>
              <a
                href={SITE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crema/70 hover:text-crema transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={22} />
              </a>
            </div>
            <p className="font-inter text-xs text-crema/50 text-center md:text-right mt-4">
              {SITE_CONFIG.instagramHandle}
            </p>
          </div>
        </div>

        <div className="border-t border-crema/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-inter text-xs text-crema/40">
            © {new Date().getFullYear()} {SITE_CONFIG.nombre}. Todos los derechos reservados.
          </p>
          <p className="font-inter text-xs text-crema/40 flex items-center gap-1">
            Hecho con <Heart size={11} className="text-coral" fill="currentColor" /> en Colombia
          </p>
        </div>
      </div>
    </footer>
  )
}
