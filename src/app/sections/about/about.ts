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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { LIFECYCLE, PROFILE } from '../../core/data/portfolio.data';
import { MotionService } from '../../core/services/motion.service';
import { Portrait } from '../../shared/portrait';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [Portrait, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly profile = PROFILE;
  protected readonly lifecycle = LIFECYCLE;
  protected readonly approach = [
    { title: 'Comprendre', text: 'Écouter les utilisateurs et le métier pour cerner le besoin réel, au-delà de la demande.' },
    { title: 'Analyser', text: 'Identifier les problèmes et modéliser le système (UML, MERISE) avant d’écrire la première ligne.' },
    { title: 'Construire', text: 'Développer, déployer et accompagner des applications robustes, intuitives et évolutives.' },
  ];

  private readonly motion = inject(MotionService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly cycle = viewChild.required<ElementRef<HTMLElement>>('cycle');
  private ctx?: gsap.Context;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.ctx?.revert());

    afterNextRender(async () => {
      const root = this.root().nativeElement;
      const cycle = this.cycle().nativeElement;
      const steps = Array.from(cycle.querySelectorAll<HTMLElement>('[data-step]'));

      if (this.motion.reduced) {
        cycle.style.setProperty('--p', '1');
        steps.forEach((s) => s.classList.add('is-on'));
        return;
      }

      await document.fonts.ready;
      this.ctx = gsap.context(() => {
        // Énoncé : les mots s'allument au fil du défilement
        const split = SplitText.create(root.querySelector('[data-words]'), { type: 'words' });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: '[data-words]', start: 'top 82%', end: 'bottom 45%', scrub: 0.4 },
          },
        );

        // Cycle de vie : rail qui se remplit et étapes qui s'allument
        ScrollTrigger.create({
          trigger: cycle,
          start: 'top 70%',
          end: 'bottom 55%',
          scrub: true,
          onUpdate: (self) => {
            cycle.style.setProperty('--p', self.progress.toFixed(3));
            const last = steps.length - 1;
            steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / last - 0.02));
          },
        });
      }, root);
    });
  }
}
