import {
  FiHome,
  FiGlobe,
  FiDatabase,
  FiMessageSquare,
  FiSettings,
 
} from 'react-icons/fi';

export const navigationData = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: FiHome,
    href: '/dashboard',
  },
  {
    name: 'sites',
    label: 'Sites Manager',
    icon: FiGlobe,
    href: '/dashboard/sites',
  },
  {
    name: 'backups',
    label: 'Backups',
    icon: FiDatabase,
    href: '/dashboard/backups',
  },
  {
    name: 'messages',
    label: 'Messages',
    icon: FiMessageSquare,
    href: '/dashboard/messages',
  },
];

export const settingsData = [
  {
    name: 'settings',
    label: 'Settings',
    icon: FiSettings,
    href: '/dashboard/settings',
  },
];
