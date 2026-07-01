import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcontractor-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📞 Contacts</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Équipe et fournisseurs</p>
      </div>

      <!-- Search -->
      <div>
        <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
          placeholder="Rechercher un contact..."
          class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 text-base shadow-lg">
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2">
        @for (cat of categories; track cat) {
        <button (click)="selectedCategory.set(cat)"
          class="px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-md"
          [class]="selectedCategory() === cat ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'">
          {{ cat }}
        </button>
        }
      </div>

      <!-- Contacts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (contact of filteredContacts(); track contact.name) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
              {{ contact.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ contact.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ contact.role }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ contact.category }}</p>
              <div class="flex items-center gap-1 mt-2">
                @for (star of [1,2,3,4,5]; track star) {
                <svg class="w-4 h-4 {{ star <= contact.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                }
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ contact.phone }}</span>
            </div>
          </div>
        </div>
        } @empty {
        <div class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg">Aucun contact trouvé</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class SubcontractorContactsComponent {
  searchQuery = signal('');
  selectedCategory = signal('Tous');

  categories = ['Tous', 'Chauffeurs', 'Soudeurs', 'Mécaniciens', 'Fournisseurs'];

  contacts = [
    // Chauffeurs
    { name: 'Hassen Hamdi', role: 'Chauffeur Poids Lourd', category: 'Chauffeurs', rating: 5, phone: '+216 50 123 456' },
    { name: 'Montassar Gharbi', role: 'Chauffeur Livraison', category: 'Chauffeurs', rating: 4, phone: '+216 52 234 567' },
    { name: 'Wassim Ben Ammar', role: 'Chauffeur Benne', category: 'Chauffeurs', rating: 4, phone: '+216 54 345 678' },
    // Soudeurs
    { name: 'Karim Soudure', role: 'Soudeur Industriel', category: 'Soudeurs', rating: 5, phone: '+216 98 456 789' },
    { name: 'Houssem Dridi', role: 'Soudeur TIG/MIG', category: 'Soudeurs', rating: 4, phone: '+216 20 567 890' },
    { name: 'Kamel Mechergui', role: 'Soudeur Haute Pression', category: 'Soudeurs', rating: 5, phone: '+216 22 678 901' },
    // Mécaniciens
    { name: 'Mehdi Trabelsi', role: 'Mécanicien Hydraulique', category: 'Mécaniciens', rating: 5, phone: '+216 23 789 012' },
    { name: 'Youssef Kacem', role: 'Mécanicien Diesel', category: 'Mécaniciens', rating: 4, phone: '+216 25 890 123' },
    { name: 'Skander Belaid', role: 'Mécanicien Engins TP', category: 'Mécaniciens', rating: 4, phone: '+216 27 901 234' },
    // Fournisseurs
    { name: 'HydraParts Tunisie', role: 'Fournisseur Pièces Hydrauliques', category: 'Fournisseurs', rating: 4, phone: '+216 71 012 345' },
    { name: 'Aciers & Métaux TN', role: 'Fournisseur Acier et Tôles', category: 'Fournisseurs', rating: 3, phone: '+216 72 123 456' },
    { name: 'Pompes & Moteurs Sfax', role: 'Fournisseur Pompes et Moteurs', category: 'Fournisseurs', rating: 5, phone: '+216 74 234 567' },
  ];

  filteredContacts() {
    let list = this.contacts;
    if (this.selectedCategory() !== 'Tous') {
      list = list.filter(c => c.category === this.selectedCategory());
    }
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
    }
    return list;
  }
}
