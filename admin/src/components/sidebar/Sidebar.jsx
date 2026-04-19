import React, { useState, useEffect } from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import EventBus, { EVENTS } from '../../events/EventBus';

// ─── Configuration Object ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: (a) => a.dashboard_icon ?? a.order_icon },
  { to: '/add',       label: 'Add Items', icon: (a) => a.add_icon },
  { to: '/list',      label: 'List Items', icon: (a) => a.order_icon },
  { to: '/orders',    label: 'Orders',    icon: (a) => a.order_icon },
];

// ─── NavItem ───────────────────────────────────────────────────────────────────
const NavItem = ({ to, label, iconSrc }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-option${isActive ? ' active' : ''}`}
  >
    <img src={iconSrc} alt="" aria-hidden="true" />
    <p>{label}</p>
  </NavLink>
);

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Observer: listen for toggle events emitted by Navbar
    const unsub = EventBus.on(EVENTS.SIDEBAR_TOGGLE, ({ isOpen }) => {
      setIsMobileOpen(isOpen);
    });
    return unsub; // unsubscribe on unmount
  }, []);

  return (
    <aside className={`sidebar${isMobileOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-options">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavItem key={to} to={to} label={label} iconSrc={icon(assets)} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
