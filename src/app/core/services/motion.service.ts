import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Point d'entrée unique pour l'animation :
 * enregistre les plugins GSAP, expose la préférence « mouvement réduit »
 * et signale la fin de l'intro pour synchroniser le Hero.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly finePointer =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /** Passe à true quand le rideau d'introduction se lève. */
  readonly introDone = signal(false);

  constructor() {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.defaults({ ease: 'expo.out', duration: 1 });
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Recalcule les positions une fois les polices chargées (évite les décalages).
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  finishIntro(): void {
    this.introDone.set(true);
  }
}
