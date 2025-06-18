import { SubMenu } from '@/@menu/vertical-menu'

export const menuMed = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Patient',
    path: '/dashboard/patient',
    icon: 'ri-user-fill'
  },
  { label: 'Fiche Patient', path: '/dashboard/fiche-patient ', icon: 'ri-dossier-line' },

  { label: 'Rendez-vous', path: '/dashboard/rendez-vous', icon: 'ri-calendar-fill' },
  {
    label: 'Demandes de rendez-vous',
    path: '/dashboard/demande-rendezVous',
    icon: 'ri-file-list-fill'
  }
]
export const menulabo = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Patient',
    path: '/dashboard/patient',
    icon: 'ri-user-fill'
  },
  {
    label: 'Analyse',
    path: '/dashboard/analyse-laboratoire',
    icon: 'ri-file-fill'
  },
  { label: 'Rendez-vous', path: '/dashboard/rendez-vous', icon: 'ri-calendar-fill' },
  {
    label: 'Demandes de rendez-vous',
    path: '/dashboard/demande-rendezVous',
    icon: 'ri-file-list-fill'
  }
]
export const menuAdmin = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Médecin',
    path: '/dashboard/medecin',
    icon: 'ri-nurse-fill'
  },
  {
    label: 'Laboratoire',
    path: '/dashboard/laboratoire',
    icon: 'ri-microscope-fill'
  },

  {
    label: 'Patient',
    path: '/dashboard/patient',
    icon: 'ri-user-fill'
  },
  {
    label: 'Paramétrage',
    icon: 'ri-settings-3-fill',
    subMenu: [
      {
        label: 'Spécialité',
        path: '/dashboard/specialite',
        icon: 'ri-star-fill'
      },
      {
        label: 'Ville',
        path: '/dashboard/ville',
        icon: 'ri-building-2-fill'
      }
    ]
  },

  {
    label: 'Réclamation',
    path: '/dashboard/reclamation',
    icon: 'ri-mail-unread-line'
  },
  {
    label: 'Confirmation',

    icon: 'ri-pass-valid-line',
    subMenu: [
      {
        label: 'Médecin',
        path: '/dashboard/confirmation-medecin',
        icon: 'ri-nurse-fill'
      },
      {
        label: 'Laboratoire',
        path: '/dashboard/confirmation-laboratoire',
        icon: 'ri-microscope-fill'
      },
      {
        label: 'Patient',
        path: '/dashboard/confirmation-patient',
        icon: 'ri-user-fill'
      }
    ]
  }

  // Autres éléments du menu
]
