import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { gsap } from 'gsap';
import { OTHER_PROJECTS } from '../../core/data/portfolio.data';
import { OtherProject } from '../../core/models/portfolio.models';
import { MotionService } from '../../core/services/motion.service';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';

type Filter = 'all' | OtherProject['group'];

/**
 * « Autres réalisations » : liste éditoriale filtrable et extensible.
 * Au survol (souris), un aperçu flottant suit le pointeur : la capture si elle existe,
 * sinon une carte typographique.
 */
@Component({
  selector: 'app-other-projects',
  imports: [Icon, RevealDirective, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './other-projects.scss',
  template: `
    <div class="others" #root>
      <header class="others__head">
        <div>
          <h3 class="others__title" appReveal>
            Autres <span class="it">réalisations</span>
            <sup class="others__count">({{ pad(items.length) }})</sup>
          </h3>
        </div>
        <p class="others__aside" appReveal [revealDelay]="80">
          Une dizaine de sites vitrines pour des activités très différentes&nbsp;: BTP, santé, beauté,
          photographie, immobilier, auto-école, formation.
        </p>
      </header>

      @if (activeFilters().length > 2) {
      <div class="others__filters" role="group" aria-label="Filtrer les réalisations" appReveal>
        @for (f of activeFilters(); track f.id) {
          <button type="button" class="ofilter" [class.is-on]="filter() === f.id" [attr.aria-pressed]="filter() === f.id"
            (click)="setFilter(f.id)">
            {{ f.label }} <span>{{ count(f.id) }}</span>
          </button>
        }
      </div>
      }

      <ul class="others__list" (pointerleave)="active.set(null)">
        @for (o of visible(); track o.name; let i = $index) {
          <li class="orow" (pointerenter)="active.set(o.name)">
            @if (o.url) {
              <a class="orow__inner" [href]="o.url" target="_blank" rel="noopener noreferrer"
                [attr.aria-label]="o.name + ' - ' + o.type + ' (nouvel onglet)'">
                <ng-container *ngTemplateOutlet="row; context: { $implicit: o, i: i }" />
                <span class="orow__go"><app-icon name="arrow-up-right" /></span>
              </a>
            } @else {
              <div class="orow__inner">
                <ng-container *ngTemplateOutlet="row; context: { $implicit: o, i: i }" />
              </div>
            }
          </li>
        }
      </ul>

      <ng-template #row let-o let-i="i">
        <span class="orow__num">{{ pad(i + 1) }}</span>
        <span class="orow__main">
          <span class="orow__name">{{ o.name }}</span>
          @if (o.stack) {
            <span class="orow__stack">{{ o.stack }}</span>
          }
        </span>
        <span class="orow__sector">{{ o.sector }}</span>
        <span class="orow__type tag">{{ o.type }}</span>
      </ng-template>

      <div class="others__preview" #preview [class.is-on]="active() !== null" aria-hidden="true">
        @for (o of items; track o.name) {
          <div class="pcv" [class.is-active]="active() === o.name">
            @if (o.image) {
              <img [src]="o.image" alt="" loading="lazy" decoding="async" />
            } @else {
              <span class="pcv__type">{{ o.type }}</span>
              <span class="pcv__name">{{ o.name }}</span>
              <span class="pcv__num">{{ o.sector }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class OtherProjects {
  protected readonly items = OTHER_PROJECTS;
  protected readonly filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'vitrine', label: 'Sites vitrines' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'app', label: 'Applications' },
  ];
  /** Seuls les filtres qui contiennent des projets sont proposés. */
  protected readonly activeFilters = computed(() => this.filters.filter((f) => this.count(f.id) > 0));
  protected readonly filter = signal<Filter>('all');
  protected readonly active = signal<string | null>(null);
  protected readonly visible = computed(() =>
    this.filter() === 'all' ? this.items : this.items.filter((o) => o.group === this.filter()),
  );

  private readonly motion = inject(MotionService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly preview = viewChild.required<ElementRef<HTMLElement>>('preview');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!this.motion.finePointer || this.motion.reduced) return;
      const root = this.root().nativeElement;
      const card = this.preview().nativeElement;
      const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };
      root.addEventListener('pointermove', move);
      destroyRef.onDestroy(() => root.removeEventListener('pointermove', move));
    });
  }

  protected setFilter(f: Filter): void {
    this.filter.set(f);
    this.active.set(null);
  }

  protected count(f: Filter): number {
    return f === 'all' ? this.items.length : this.items.filter((o) => o.group === f).length;
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
