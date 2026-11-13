import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../core/services/motion.service';

/** Attraction magnétique subtile vers le pointeur (souris uniquement). */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective implements OnDestroy {
  readonly strength = input(0.28, { alias: 'appMagnetic', transform: (v: unknown) => (typeof v === 'number' ? v : 0.28) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      if (this.motion.reduced || !this.motion.finePointer) return;
      const node = this.el.nativeElement;
      const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' });

      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * this.strength());
        yTo((e.clientY - (r.top + r.height / 2)) * this.strength());
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      node.addEventListener('pointermove', move);
      node.addEventListener('pointerleave', leave);
      this.cleanup = () => {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', leave);
        gsap.killTweensOf(node);
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
