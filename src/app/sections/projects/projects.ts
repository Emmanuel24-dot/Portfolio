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
import { PROJECTS } from '../../core/data/portfolio.data';
import { Project } from '../../core/models/portfolio.models';
import { ContactIntentService } from '../../core/services/contact-intent.service';
import { MotionService } from '../../core/services/motion.service';
import { Button } from '../../shared/button';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { OtherProjects } from './other-projects';
import { ProjectVisual } from './project-visual';

@Component({
  selector: 'app-projects',
  imports: [Button, Icon, RevealDirective, ProjectVisual, OtherProjects],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly projects = PROJECTS;

  private readonly motion = inject(MotionService);
  private readonly intent = inject(ContactIntentService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private mm?: gsap.MatchMedia;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.mm?.revert());

    afterNextRender(() => {
      if (this.motion.reduced) return;
      const root = this.root().nativeElement;
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));

      this.mm = gsap.matchMedia(root);

      // Empilement : chaque panneau recule quand le suivant le recouvre
      this.mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: next.parentElement,
              start: 'top bottom',
              end: 'top top+=88',
              scrub: true,
            },
          });
          tl.to(card, { scale: 0.9, yPercent: -3, ease: 'none' }, 0).to(
            card.querySelector('.pcard__shade'),
            { opacity: 0.62, ease: 'none' },
            0,
          );
        });
      });

      // Mobile / tablette : simple apparition
      this.mm.add('(max-width: 1023.98px), (max-height: 699.98px)', () => {
        cards.forEach((card) => {
          gsap.from(card, {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });
      });
    });
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  protected ask(p: Project): void {
    this.intent.prefill({
      subject: 'Projet freelance',
      message: `Bonjour Emmanuel,\n\nJ’ai découvert le projet « ${p.name} » sur votre portfolio et j’aimerais échanger au sujet d’un projet similaire.\n\n`,
    });
  }
}
