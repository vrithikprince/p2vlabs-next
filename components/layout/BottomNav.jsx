'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '../ui/Icon.jsx'

/**
 * Mobile bottom nav. The Vite app showed Home / Reel / Login (or Dashboard
 * when logged in); the public Next.js site has no in-app auth, so we show
 * Home / Reel / About and a Login icon that links to clients.p2vlabs.in.
 */
const ITEMS = [
  { id: 'home',  icon: 'home',   label: 'Home',  path: '/'         },
  { id: 'reel',  icon: 'film',   label: 'Reel',  path: '/reel'     },
  { id: 'about', icon: 'inbox',  label: 'About', path: '/about'    },
  { id: 'login', icon: 'lock',   label: 'Login', path: 'https://clients.p2vlabs.in/login', external: true },
]

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-bone/12">
      <div className="flex">
        {ITEMS.map(({ id, icon, label, path, external }) => {
          const cls = `flex-1 py-3 flex flex-col items-center gap-1 text-[10px] tracking-wider uppercase font-medium transition-colors ${
            isActive(path) ? 'text-amber' : 'text-bone/45'
          }`
          if (external) {
            return (
              <a key={id} href={path} className={cls}>
                <Icon n={icon} s={19} />
                {label}
              </a>
            )
          }
          return (
            <Link key={id} href={path} className={cls}>
              <Icon n={icon} s={19} />
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
