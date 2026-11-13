import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { TECH_GROUPS } from '../../core/data/portfolio.data';
import { MotionService } from '../../core/services/motion.service';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-stack',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  protected readonly groups = TECH_GROUPS;
  protected readonly total = TECH_GROUPS.reduce((n, g) => n + g.items.length, 0);

  private readonly motion = inject(MotionService);
  private readonly sheet = viewChild.required<ElementRef<HTMLElement>>('sheet');
  private ctx?: gsap.Context;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.ctx?.revert());

    afterNextRender(() => {
      if (this.motion.reduced) return;
      const sheet = this.sheet().nativeElement;
      this.ctx = gsap.context(() => {
        // La « feuille » papier se déploie en entrant dans l'écran
        gsap.fromTo(
          sheet,
          { scale: 0.94, borderRadius: 64 },
          {
            scale: 1,
            borderRadius: 32,
            ease: 'none',
            scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 25%', scrub: 0.5 },
          },
        );
      }, sheet);
    });
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
