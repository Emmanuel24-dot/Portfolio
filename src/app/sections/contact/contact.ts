import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT, PROFILE } from '../../core/data/portfolio.data';
import { ContactIntentService } from '../../core/services/contact-intent.service';
import { Button } from '../../shared/button';
import { Icon } from '../../shared/icon';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { RevealDirective } from '../../shared/reveal.directive';

type SendState = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Button, Icon, MagneticDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;
  protected readonly socials = CONTACT.socials.filter((s) => !!s.url);
  protected readonly whatsapp = CONTACT.phones.find((p) => p.whatsapp) ?? CONTACT.phones[0];
  protected readonly whatsappUrl = this.whatsapp
    ? `https://wa.me/${this.whatsapp.e164}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`
    : '';
  protected readonly subjects = ['Projet freelance', 'Opportunité d’emploi', 'Collaboration', 'Autre'];
  protected readonly maxMessage = 2000;

  protected readonly state = signal<SendState>('idle');
  protected readonly submitted = signal(false);
  protected readonly copied = signal<'idle' | 'ok' | 'fail'>('idle');

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly messageField = viewChild<ElementRef<HTMLTextAreaElement>>('messageField');
  private copyTimer?: ReturnType<typeof setTimeout>;

  protected readonly form = this.fb.group({
    subject: [this.subjects[0], Validators.required],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(this.maxMessage)]],
    website: [''], // pot de miel anti-spam (invisible)
  });

  constructor() {
    const intent = inject(ContactIntentService);
    effect(() => {
      const i = intent.intent();
      if (!i) return;
      this.form.patchValue({ subject: i.subject, message: i.message });
      this.state.set('idle');
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copyTimer));
  }

  protected showError(name: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  protected errorText(name: 'name' | 'email' | 'message'): string {
    const c = this.form.controls[name];
    if (c.hasError('required')) {
      return { name: 'Indiquez votre nom.', email: 'Indiquez votre adresse email.', message: 'Écrivez votre message.' }[name];
    }
    if (c.hasError('pattern')) return 'Cette adresse email ne semble pas valide.';
    if (c.hasError('minlength')) {
      const min = c.getError('minlength').requiredLength;
      return name === 'message'
        ? `Quelques mots de plus : ${min} caractères minimum.`
        : `${min} caractères minimum.`;
    }
    if (c.hasError('maxlength')) return 'Ce champ est trop long.';
    return '';
  }

  protected async submit(): Promise<void> {
    if (this.state() === 'sending') return;
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Attendre le rendu des états d'erreur avant de placer le focus
      setTimeout(() =>
        this.host.nativeElement
          .querySelector<HTMLElement>('.field.is-invalid input, .field.is-invalid textarea')
          ?.focus(),
      );
      return;
    }

    const { subject, name, email, message, website } = this.form.getRawValue();

    // Robot détecté : on simule un succès sans rien envoyer.
    if (website) {
      this.finish('sent');
      return;
    }

    if (!CONTACT.formEndpoint) {
      const mailSubject = `[Portfolio] ${subject} - ${name}`;
      const body = `${message.trim()}\n\n-\n${name}\n${email}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
      this.state.set('mailto');
      return;
    }

    this.state.set('sending');
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, subject, message, _subject: `[Portfolio] ${subject} - ${name}` }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.finish('sent');
    } catch {
      this.state.set('error');
    }
  }

  protected reset(): void {
    this.state.set('idle');
    setTimeout(() => this.messageField()?.nativeElement.focus(), 60);
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      this.copied.set('ok');
    } catch {
      this.copied.set('fail');
    }
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copied.set('idle'), 2200);
  }

  private finish(state: SendState): void {
    this.state.set(state);
    this.submitted.set(false);
    this.form.reset({ subject: this.subjects[0], name: '', email: '', message: '', website: '' });
  }
}
