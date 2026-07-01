import { Injectable, signal, computed } from '@angular/core';
import { UserRole } from './role.service';

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  role: UserRole;
}

const FAKE_NOTIFICATIONS: Notification[] = [
  // ===== OWNER NOTIFICATIONS =====
  { id: 'n-001', type: 'critical', title: 'Stock Critique - Kairouan', message: 'Stock critique de Tuyaux 1 pouce à Kairouan - Stock: 8/40 unités', timestamp: new Date(Date.now() - 5 * 60000), read: false, role: 'owner' },
  { id: 'n-002', type: 'warning', title: 'Stock Faible - Sfax', message: 'Stock faible de Raccords 2 pouces à Sfax - Stock: 100/200', timestamp: new Date(Date.now() - 15 * 60000), read: false, role: 'owner' },
  { id: 'n-003', type: 'critical', title: 'Retard Sous-traitant', message: 'Ahmed Hydraulique est en retard sur le chantier Kairouan - date dépassée de 2 jours', timestamp: new Date(Date.now() - 30 * 60000), read: false, role: 'owner' },
  { id: 'n-004', type: 'warning', title: 'PO en Attente', message: 'Commande d\'achat PO-001 en attente d\'approbation - 12 450 TND', timestamp: new Date(Date.now() - 1 * 3600000), read: true, role: 'owner' },
  { id: 'n-005', type: 'critical', title: 'Consommation Anormale', message: 'ALERTE: Karim Soudure a consommé 120m de Tuyau 2 pouces aujourd\'hui - 3x la moyenne', timestamp: new Date(Date.now() - 2 * 3600000), read: false, role: 'owner' },
  { id: 'n-006', type: 'warning', title: 'Paiement en Retard', message: 'Facture Ahmed Hydraulique en retard: 3 200 TND - échéance dépassée de 5 jours', timestamp: new Date(Date.now() - 3 * 3600000), read: true, role: 'owner' },
  { id: 'n-007', type: 'critical', title: 'Rupture de Stock', message: 'Stock critique: Flexible Hydraulique 3/4 pouces - RUPTURE totale à Kairouan', timestamp: new Date(Date.now() - 4 * 3600000), read: false, role: 'owner' },
  { id: 'n-008', type: 'warning', title: 'Dépassement Budget', message: 'Projet Sousse: dépassement de budget de 15% - 48 000 TND dépensés sur 42 000 TND prévus', timestamp: new Date(Date.now() - 5 * 3600000), read: true, role: 'owner' },
  { id: 'n-009', type: 'info', title: 'Nouveau Sous-traitant', message: 'Nouveau sous-traitant disponible: Société Générale TP - Spécialisé en génie civil', timestamp: new Date(Date.now() - 6 * 3600000), read: false, role: 'owner' },
  { id: 'n-010', type: 'critical', title: 'Stock Critique - Pompes', message: 'Pompe Hydraulique Parker: stock critique - 5 pièces seulement', timestamp: new Date(Date.now() - 8 * 3600000), read: false, role: 'owner' },
  { id: 'n-011', type: 'warning', title: 'Expiration Produit', message: 'Huile Hydraulique ISO 46: expiration dans 30 jours - 25 bidons en stock', timestamp: new Date(Date.now() - 10 * 3600000), read: true, role: 'owner' },
  { id: 'n-012', type: 'warning', title: 'Progression Projet', message: 'Progression projet Central Warehouse: 25% - en retard sur le planning de 2 semaines', timestamp: new Date(Date.now() - 12 * 3600000), read: false, role: 'owner' },

  // ===== MANAGER NOTIFICATIONS =====
  { id: 'n-020', type: 'warning', title: 'Nouvelle Demande', message: 'Mohamed Ben Ali demande 30m de Tuyau Hydraulique 2 pouces pour Site Tunis', timestamp: new Date(Date.now() - 2 * 60000), read: false, role: 'manager' },
  { id: 'n-021', type: 'critical', title: 'Stock Critique', message: 'Stock critique: Tuyau Hydraulique 1 pouce à l\'Entrepôt Principal - 8/40 unités', timestamp: new Date(Date.now() - 10 * 60000), read: false, role: 'manager' },
  { id: 'n-022', type: 'warning', title: 'Demande Transfert', message: 'Demande de transfert: 50 Raccords 2 pouces vers Site Kairouan', timestamp: new Date(Date.now() - 20 * 60000), read: true, role: 'manager' },
  { id: 'n-023', type: 'critical', title: 'Expiration dans 30 jours', message: 'Huile Hydraulique ISO 46: 25 bidons expireront le 30/06/2025', timestamp: new Date(Date.now() - 25 * 60000), read: false, role: 'manager' },
  { id: 'n-024', type: 'warning', title: 'Écart Inventaire', message: 'Inventaire: écart détecté sur Pompe Parker - 5 en système vs 4 en physique', timestamp: new Date(Date.now() - 45 * 60000), read: false, role: 'manager' },
  { id: 'n-025', type: 'critical', title: 'Rupture: Flexible 3/4', message: 'Flexible Hydraulique 3/4 pouces: RUPTURE DE STOCK - 0 en stock', timestamp: new Date(Date.now() - 1 * 3600000), read: true, role: 'manager' },
  { id: 'n-026', type: 'warning', title: 'Demande Ahmed', message: 'Ahmed Hydraulique demande 30m de Tuyau 2 pouces pour Site Kairouan', timestamp: new Date(Date.now() - 2 * 3600000), read: false, role: 'manager' },
  { id: 'n-027', type: 'info', title: 'Nouveau Produit', message: 'Nouveau produit ajouté: Cylindre Hydraulique Simple Effet - Réf: CYLINDER-SE-100', timestamp: new Date(Date.now() - 3 * 3600000), read: true, role: 'manager' },
  { id: 'n-028', type: 'warning', title: 'Stock Faible - Sfax', message: 'Site Sfax: 2 articles en stock critique, besoin de réapprovisionnement', timestamp: new Date(Date.now() - 4 * 3600000), read: false, role: 'manager' },
  { id: 'n-029', type: 'info', title: 'Transfert Effectué', message: 'Transfert de stock: 20 Raccords vers Site Tunis - livraison confirmée', timestamp: new Date(Date.now() - 5 * 3600000), read: true, role: 'manager' },
  { id: 'n-030', type: 'critical', title: 'Stock Négatif', message: 'Stock négatif détecté: Flexible 3/4 pouces - valeur: -5, vérification requise', timestamp: new Date(Date.now() - 6 * 3600000), read: false, role: 'manager' },
  { id: 'n-031', type: 'warning', title: 'Rappel Inventaire', message: 'Rappel: Inventaire mensuel obligatoire dans 3 jours - tous les sites concernés', timestamp: new Date(Date.now() - 7 * 3600000), read: true, role: 'manager' },

  // ===== SUBCONTRACTOR NOTIFICATIONS =====
  { id: 'n-040', type: 'info', title: 'Nouvelle Tâche', message: 'Nouvelle tâche assignée: Installation tuyauterie Sfax - ORD-001 - Date limite: 15/07', timestamp: new Date(Date.now() - 1 * 60000), read: false, role: 'subcontractor' },
  { id: 'n-041', type: 'success', title: 'Demande Approuvée', message: '✅ Demande de matériel approuvée: Tuyaux Hydrauliques 2 pouces - 30m pour Site Tunis', timestamp: new Date(Date.now() - 5 * 60000), read: false, role: 'subcontractor' },
  { id: 'n-042', type: 'critical', title: 'Demande Refusée', message: '❌ Demande de matériel refusée: Pompe Parker - stock insuffisant', timestamp: new Date(Date.now() - 10 * 60000), read: false, role: 'subcontractor' },
  { id: 'n-043', type: 'success', title: 'Paiement Approuvé', message: '✅ Paiement approuvé: 1 200 TND pour Installation tuyauterie Kairouan - Phase 1', timestamp: new Date(Date.now() - 30 * 60000), read: true, role: 'subcontractor' },
  { id: 'n-044', type: 'warning', title: 'Échéance Approche', message: 'Rappel: Site Kairouan - date d\'échéance dans 5 jours (15/07/2024)', timestamp: new Date(Date.now() - 1 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-045', type: 'critical', title: 'Urgent: Matériel', message: 'Urgent: besoin de 20m de Flexible Hydraulique 3/4 pouces pour finir le chantier Sfax', timestamp: new Date(Date.now() - 2 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-046', type: 'info', title: 'Nouveau Message', message: 'Nouveau message de Ahmed Ben Ali: "Vérifiez l\'état des raccords avant installation"', timestamp: new Date(Date.now() - 3 * 3600000), read: true, role: 'subcontractor' },
  { id: 'n-047', type: 'success', title: 'Consommation Validée', message: '✅ Consommation validée: 50m de Tuyau Hydraulique 2 pouces - Site Kairouan', timestamp: new Date(Date.now() - 4 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-048', type: 'warning', title: 'Progression Sfax', message: 'Site Sfax: progression 75% - objectif cette semaine: 85%', timestamp: new Date(Date.now() - 5 * 3600000), read: true, role: 'subcontractor' },
  { id: 'n-049', type: 'info', title: 'Paiement en Cours', message: 'Paiement en cours: 850 TND - Réparation pompe Sfax - Traitement en cours', timestamp: new Date(Date.now() - 6 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-050', type: 'warning', title: 'Rapport Hebdomadaire', message: 'Rappel: Rapport d\'activité hebdomadaire à soumettre avant vendredi 17:00', timestamp: new Date(Date.now() - 7 * 3600000), read: true, role: 'subcontractor' },
  { id: 'n-051', type: 'critical', title: 'Matériel Insuffisant', message: 'Matériel insuffisant sur Site Tunis: besoin de 10 Raccords supplémentaires pour terminer', timestamp: new Date(Date.now() - 8 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-052', type: 'success', title: 'Contact Ajouté', message: 'Nouveau contact ajouté: Hassen Hamdi - Chauffeur Poids Lourd - 5 étoiles', timestamp: new Date(Date.now() - 10 * 3600000), read: true, role: 'subcontractor' },
  { id: 'n-053', type: 'info', title: 'Inspection', message: 'Site Tunis: inspection prévue demain à 08:00 - soyez présent sur le site', timestamp: new Date(Date.now() - 12 * 3600000), read: false, role: 'subcontractor' },
  { id: 'n-054', type: 'success', title: 'Retour Confirmé', message: '✅ Retour de matériel confirmé: 5 Raccords 2 pouces - Site Kairouan - stock mis à jour', timestamp: new Date(Date.now() - 24 * 3600000), read: false, role: 'subcontractor' },
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>(FAKE_NOTIFICATIONS);

  readonly notifications = this.notificationsSignal.asReadonly();

  getUnreadCount(role: UserRole): number {
    return this.notificationsSignal().filter((n: Notification) => n.role === role && !n.read).length;
  }

  getNotificationsForRole(role: UserRole): Notification[] {
    return this.notificationsSignal()
      .filter((n: Notification) => n.role === role)
      .sort((a: Notification, b: Notification) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update(notifications =>
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(role: UserRole): void {
    this.notificationsSignal.update(notifications =>
      notifications.map(n => n.role === role ? { ...n, read: true } : n)
    );
  }

  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotif: Notification = {
      ...notification,
      id: `n-${Date.now()}`
    };
    this.notificationsSignal.update(notifications => [newNotif, ...notifications]);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'il y a ' + seconds + 's';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return 'il y a ' + minutes + 'min';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return 'il y a ' + hours + 'h';
    const days = Math.floor(hours / 24);
    if (days === 1) return 'hier';
    if (days < 7) return 'il y a ' + days + ' jours';
    return date.toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' });
  }
}
