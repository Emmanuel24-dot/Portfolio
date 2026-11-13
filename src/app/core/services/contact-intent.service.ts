import { Injectable, signal } from '@angular/core';

export interface ContactIntent {
  subject: string;
  message: string;
}

/** Permet aux autres sections (ex. un projet) de pré-remplir le formulaire de contact. */
@Injectable({ providedIn: 'root' })
export class ContactIntentService {
  readonly intent = signal<ContactIntent | null>(null);

  prefill(intent: ContactIntent): void {
    this.intent.set({ ...intent });
  }
}
