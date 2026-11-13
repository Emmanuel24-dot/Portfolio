import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../core/services/motion.service';

const LOG_LINES = ['init portfolio', 'load fonts', 'compile ui', 'ready'];

@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './preloader.scss',
  template: `
    @if (!gone()) {
      <div class="pre" #root aria-hidden="true">
        <div class="pre__top">
          <span>Emmanuel Tchedie</span>
          <span>Portfolio - {{ year }}</span>
        </div>
        <div class="pre__center">
          <span class="pre__count" #count>000</span>
          <span class="pre__log">&gt; {{ log() }}<i class="caret"></i></span>
        </div>
        <div class="pre__bar"><span #bar></span></div>
      </div>
    }
  `,
})
export class Preloader {
  private readonly motion = inject(MotionService);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private readonly count = viewChild<ElementRef<HTMLElement>>('count');
  private readonly bar = viewChild<ElementRef<HTMLElement>>('bar');

  protected readonly gone = signal(false);
  protected readonly log = signal(LOG_LINES[0]);
  protected readonly year = new Date().getFullYear();

  constructor() {
    afterNextRender(() => this.run());
  }

  private async run(): Promise<void> {
    const html = document.documentElement;
    const root = this.root()?.nativeElement;
    const count = this.count()?.nativeElement;
    const bar = this.bar()?.nativeElement;
    if (!root || !count || !bar) return this.done();

    html.classList.add('is-locked');

    let seen = false;
    try {
      seen = sessionStorage.getItem('et-intro') === '1';
      sessionStorage.setItem('et-intro', '1');
    } catch {
      /* stockage indisponible : on ignore */
    }

    const fast = this.motion.reduced || seen;
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(2500)]);
    const counter = { v: 0 };

    await new Promise<void>((resolve) => {
      gsap.to(counter, {
        v: 100,
        duration: fast ? 0.45 : 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(counter.v);
          count.textContent = String(v).padStart(3, '0');
          bar.style.transform = `scaleX(${counter.v / 100})`;
          this.log.set(LOG_LINES[Math.min(LOG_LINES.length - 1, Math.floor(v / 26))]);
        },
        onComplete: resolve,
      });
    });
    await fonts;

    if (this.motion.reduced) {
      gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: () => this.done() });
      this.motion.finishIntro();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => this.done() });
    tl.to(root.querySelectorAll('.pre__top, .pre__center, .pre__bar'), {
      y: -24,
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power2.in',
      stagger: 0.04,
    })
      .to(root, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '-=0.1')
      .add(() => this.motion.finishIntro(), '-=0.75');
  }

  private done(): void {
    document.documentElement.classList.remove('is-locked');
    this.motion.finishIntro();
    this.gone.set(true);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
