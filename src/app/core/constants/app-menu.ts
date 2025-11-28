export interface AppMenuItem {
  label: string;
  path: string;
  icon?: string;
  roles?: string[]; // roles mínimos para ver el item
}

export const APP_MENU: AppMenuItem[] = [
  { label: 'Inicio', path: '/home', icon: 'home' },
  { label: 'Usuarios', path: '/admin/users', icon: 'group', roles: ['Admin'] },
  {
    label: 'Reportes',
    path: '/reports',
    icon: 'bar_chart',
    roles: ['Admin', 'Report'],
  },
];
