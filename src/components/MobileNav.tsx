import { useCallback, useEffect, useRef, useState } from 'react'
import { primaryLinks } from './nav-links'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideMenu = navRef.current?.contains(target) ?? false
      const insideButton = buttonRef.current?.contains(target) ?? false
      if (!insideMenu && !insideButton) close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open, close])

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls="primary-menu"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <nav
        ref={navRef}
        id="primary-menu"
        aria-label="Primary"
        className={open ? 'mobile-nav__menu is-open' : 'mobile-nav__menu'}
      >
        <ul>
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
