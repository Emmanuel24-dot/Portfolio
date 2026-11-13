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
import { EXPERIENCES } from '../../core/data/portfolio.data';
import { MotionService } from '../../core/services/motion.service';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './experience.scss',
  template: `
    <section class="xp-section section" id="experience" aria-labelledby="xp-title">
      <div class="container">
        <header class="section-head">
          <div>
            <p class="eyebrow" appReveal><b>[04]</b> Parcours</p>
            <h2 class="section-head__title" id="xp-title" appReveal [revealDelay]="60">
              Expérience <span class="it">professionnelle</span>
            </h2>
          </div>
          <p class="section-head__aside" appReveal [revealDelay]="120">
            Du développement web au travail de terrain&nbsp;: des missions qui demandent rigueur,
            méthode et sens du détail.
          </p>
        </header>

        <ol class="timeline" #timeline>
          @for (xp of experiences; track xp.year + xp.role) {
            <li class="xp" appReveal>
              <p class="xp__year" [attr.data-year]="xp.year"><span>{{ xp.year }}</span></p>
              <div class="xp__body">
                <h3 class="xp__role">{{ xp.role }}</h3>
                @if (xp.company || xp.location) {
                  <p class="xp__company">
                    {{ xp.company }}@if (xp.company && xp.location) {<span> - </span>}@if (xp.location) {<span>{{ xp.location }}</span>}
                  </p>
                }
                <ul class="xp__points">
                  @for (pt of xp.points; track pt) {
                    <li>{{ pt }}</li>
                  }
                </ul>
                <ul class="xp__tags" aria-label="Mots-clés">
                  @for (t of xp.tags; track t) {
                    <li class="tag">{{ t }}</li>
                  }
                </ul>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class ExperienceSection {
  protected readonly experiences = EXPERIENCES;

  private readonly motion = inject(MotionService);
  private readonly timeline = viewChild.required<ElementRef<HTMLElement>>('timeline');
  private ctx?: gsap.Context;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.ctx?.revert());
    afterNextRender(() => {
      const el = this.timeline().nativeElement;
      if (this.motion.reduced) {
        el.style.setProperty('--p', '1');
        return;
      }
      this.ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          end: 'bottom 60%',
          onUpdate: (self) => el.style.setProperty('--p', self.progress.toFixed(3)),
        });
      }, el);
    });
  }
}
