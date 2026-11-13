import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { LIFECYCLE, PROFILE } from '../../core/data/portfolio.data';
import { MotionService } from '../../core/services/motion.service';
import { Button } from '../../shared/button';
import { LocalTime } from '../../shared/local-time';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { Portrait } from '../../shared/portrait';
import { SystemMap } from './system-map';

@Component({
  selector: 'app-hero',
  imports: [Button, MagneticDirective, LocalTime, Portrait, SystemMap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly profile = PROFILE;
  protected readonly lifecycle = LIFECYCLE;
  protected readonly year = new Date().getFullYear();

  private readonly motion = inject(MotionService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private ctx?: gsap.Context;
  private intro?: gsap.core.Timeline;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.ctx?.revert());

    afterNextRender(async () => {
      if (this.motion.reduced) return;
      await document.fonts.ready;
      const root = this.root().nativeElement;

      this.ctx = gsap.context(() => {
        const split = SplitText.create(root.querySelectorAll('[data-split]'), {
          type: 'chars',
          mask: 'chars',
          charsClass: 'hero__char',
        });

        this.intro = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.035 })
          .from('.hero__portrait', { clipPath: 'inset(0 100% 0 0 round 999px)', duration: 1.3, ease: 'expo.inOut' }, 0.2)
          .from('.hero__caret', { scaleY: 0, transformOrigin: 'bottom', duration: 0.6 }, 0.8)
          .from('[data-intro]', { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.07 }, 0.45);

        // Parallaxe douce en sortie de section
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 } })
          .to('.hero__line--1', { xPercent: -6, ease: 'none' }, 0)
          .to('.hero__line--2', { xPercent: 5, ease: 'none' }, 0)
          .to('.hero__glow', { yPercent: 30, autoAlpha: 0.2, ease: 'none' }, 0);
      }, root);

      if (this.motion.introDone()) this.intro?.play();
    });

    effect(() => {
      if (this.motion.introDone()) queueMicrotask(() => this.intro?.play());
    });
  }
}
