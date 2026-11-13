import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CONTACT, NAV_LINKS, PROFILE } from '../core/data/portfolio.data';
import { Icon } from '../shared/icon';
import { MagneticDirective } from '../shared/magnetic.directive';

@Component({
  selector: 'app-header',
  imports: [Icon, MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'close()' },
  templateUrl: './header.html',
})
export class Header {
  protected readonly links = NAV_LINKS;
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;
  protected readonly socials = CONTACT.socials.filter((s) => !!s.url);

  protected readonly open = signal(false);
  protected readonly hidden = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal<string>('');
  protected readonly progress = signal(0);

  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('menuBtn');
  private readonly firstLink = viewChild<ElementRef<HTMLAnchorElement>>('firstLink');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    let lockedByMenu = false;
    effect(() => {
      const isOpen = this.open();
      if (isOpen || lockedByMenu) {
        document.documentElement.classList.toggle('is-locked', isOpen);
        lockedByMenu = isOpen;
      }
      if (isOpen) queueMicrotask(() => this.firstLink()?.nativeElement.focus());
    });

    afterNextRender(() => {
      this.watchScroll();
      this.watchSections();
    });
  }

  protected toggle(): void {
    this.open.update((v) => !v);
    if (!this.open()) this.toggleBtn()?.nativeElement.focus();
  }

  protected close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.toggleBtn()?.nativeElement.focus();
  }

  protected navigate(): void {
    this.open.set(false);
  }

  private watchScroll(): void {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      this.progress.set(max > 0 ? Math.min(1, y / max) : 0);
      this.scrolled.set(y > 24);
      if (!this.open()) {
        const delta = y - lastY;
        if (y < 160 || delta < -6) this.hidden.set(false);
        else if (delta > 6) this.hidden.set(true);
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  }

  private watchSections(): void {
    const ids = ['top', ...this.links.map((l) => l.id)];
    const targets = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => !!n);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.active.set(e.target.id === 'top' ? '' : e.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    this.destroyRef.onDestroy(() => io.disconnect());
  }
}
