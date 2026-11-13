import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Apparition au défilement, sans dépendance : IntersectionObserver + transitions CSS.
 * <div appReveal></div> · <div appReveal="clip" [revealDelay]="120"></div>
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[attr.data-reveal]': "appReveal() || 'up'",
    '[style.--reveal-delay.ms]': 'revealDelay()',
  },
})
export class RevealDirective implements OnDestroy {
  readonly appReveal = input<'' | 'up' | 'fade' | 'clip'>('');
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (!('IntersectionObserver' in window)) {
        node.classList.add('is-in');
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('is-in');
              this.observer?.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );
      // Un élément masqué par son propre clip-path n'est jamais « visible » : on observe son parent.
      const target = this.appReveal() === 'clip' && node.parentElement ? node.parentElement : node;
      this.observer.observe(target);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
