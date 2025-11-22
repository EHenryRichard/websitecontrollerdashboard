import {
  FiHome,
  FiGlobe,
  FiDatabase,
  FiMessageSquare,
  FiSettings,
  FiUserPlus,
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
  {
    name: 'register-client',
    label: 'Register Client',
    icon: FiUserPlus,
    href: '/dashboard/register-client',
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
