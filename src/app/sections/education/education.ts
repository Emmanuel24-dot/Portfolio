import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION } from '../../core/data/portfolio.data';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-education',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './education.scss',
  template: `
    <section class="edu section" id="formation" aria-labelledby="edu-title">
      <div class="container">
        <div class="edu__grid">
          <header class="edu__head">
            <p class="eyebrow" appReveal><b>[05]</b> Formation</p>
            <h2 class="edu__title" id="edu-title" appReveal [revealDelay]="60">
              Bases <span class="it">académiques</span>
            </h2>
          </header>

          <ul class="edu__list">
            @for (e of education; track e.title; let i = $index) {
              <li class="degree" [class.degree--live]="e.inProgress" appReveal [revealDelay]="i * 100">
                <div class="degree__top">
                  <span class="degree__period">{{ e.period }}</span>
                  <span class="degree__status">
                    @if (e.inProgress) {
                      <span class="degree__steps" aria-hidden="true"><i></i><i></i><i></i></span>
                    }
                    {{ e.status }}
                  </span>
                </div>
                <h3 class="degree__title">{{ e.title }}</h3>
                @if (e.speciality) {
                  <p class="degree__spec">{{ e.speciality }}</p>
                }
                <p class="degree__school">{{ e.location }}</p>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class EducationSection {
  protected readonly education = EDUCATION;
}
