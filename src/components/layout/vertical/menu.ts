import { SubMenu } from '@/@menu/vertical-menu'

export const menuMed = [
  {
    label: 'Dashboard Med',
    path: '/',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Patient',
    path: '/patient',
    icon: 'ri-user-fill'
  },
  { label: 'Fiche Patient', path: '/fiche-patient ', icon: 'ri-dossier-line' },

  { label: 'Rendez-vous', path: '/rendez-vous', icon: 'ri-calendar-fill' },
  {
    label: 'Demandes de rendez-vous',
    path: '/demande-rendezVous',
    icon: 'ri-file-list-fill'
  }
]
export const menulabo = [
  {
    label: 'Dashboard Labo',
    path: '/',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Patient',
    path: '/patient',
    icon: 'ri-user-fill'
  },
  {
    label: 'Analyse',
    path: '/analyse-laboratoire',
    icon: 'ri-file-fill'
  },
  { label: 'Rendez-vous', path: '/rendez-vous', icon: 'ri-calendar-fill' },
  {
    label: 'Demandes de rendez-vous',
    path: '/demande-rendezVous',
    icon: 'ri-file-list-fill'
  }
]
export const menuAdmin = [
  {
    label: 'Dashboard admin',
    path: '/',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Médecin',
    path: '/medecin',
    icon: 'ri-nurse-fill'
  },
  {
    label: 'Laboratoire',
    path: '/laboratoire',
    icon: 'ri-microscope-fill'
  },
  {
    label: 'Admin',
    path: '/admin',
    icon: 'ri-vip-crown-fill'
  },
  {
    label: 'Patient',
    path: '/patient',
    icon: 'ri-user-fill'
  },
  {
    label: 'Paramétrage',
    icon: 'ri-settings-3-fill',
    subMenu: [
      {
        label: 'Spécialité',
        path: '/specialite',
        icon: 'ri-star-fill'
      },
      {
        label: 'Ville',
        path: '/ville',
        icon: 'ri-building-2-fill'
      },
      {
        label: 'Service',
        path: '/service',
        icon: 'ri-service-fill'
      }
    ]
  },

  {
    label: 'Réclamation',
    path: '/reclamation',
    icon: 'ri-mail-unread-line'
  },
  {
    label: 'Confirmation',

    icon: 'ri-pass-valid-line',
    subMenu: [
      {
        label: 'Médecin',
        path: '/confirmation-medecin',
        icon: 'ri-nurse-fill'
      },
      {
        label: 'Laboratoire',
        path: '/confirmation-laboratoire',
        icon: 'ri-microscope-fill'
      },
      {
        label: 'Patient',
        path: '/confirmation-patient',
        icon: 'ri-user-fill'
      }
    ]
  }

  // Autres éléments du menu
]
