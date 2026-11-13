import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MotionService } from '../../core/services/motion.service';

const LOG = [
  ['analyse', 'besoins utilisateurs'],
  ['conception', 'UML · MERISE'],
  ['build', 'Angular · Flutter'],
  ['api', 'Spring Boot · Laravel'],
  ['data', 'MySQL · Oracle'],
  ['deploy', 'mise en production'],
  ['formation', 'utilisateurs'],
] as const;

interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  core?: boolean;
}

/**
 * Carte d'architecture full stack : client web / mobile → API REST → données.
 * Les paquets circulent en SVG natif (animateMotion), sans JavaScript d'animation.
 */
@Component({
  selector: 'app-system-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './system-map.scss',
  host: { '(pointermove)': 'tilt($event)', '(pointerleave)': 'resetTilt()' },
  template: `
    <div class="map" #card>
      <div class="map__bar">
        <span>stack.map</span>
        <span class="map__live"><i></i>full stack</span>
      </div>

      <svg #svg class="map__svg" viewBox="0 0 420 340" role="img"
        aria-labelledby="map-title map-desc">
        <title id="map-title">Architecture d’une application full stack</title>
        <desc id="map-desc">Un client web Angular et une application mobile Flutter communiquent avec une API REST
          Spring Boot ou Laravel, reliée à une base de données MySQL ou Oracle.</desc>

        <defs>
          <pattern id="map-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" class="dot" />
          </pattern>
        </defs>
        <rect width="420" height="340" fill="url(#map-dots)" />

        @for (p of paths; track p.id) {
          <path [attr.id]="p.id" class="wire" [attr.d]="p.d" />
          <path class="wire wire--flow" [attr.d]="p.d" />
        }

        <text class="tag" x="96" y="116">REST</text>
        <text class="tag" x="292" y="116">JSON</text>
        <text class="tag" x="220" y="244">SQL</text>

        @for (n of nodes; track n.label) {
          <g class="node" [class.node--core]="n.core">
            <rect [attr.x]="n.x" [attr.y]="n.y" [attr.width]="n.w" [attr.height]="n.h" rx="10" />
            <text class="node__label" [attr.x]="n.x + 14" [attr.y]="n.y + 27">{{ n.label }}</text>
            <text class="node__sub" [attr.x]="n.x + 14" [attr.y]="n.y + 47">{{ n.sub }}</text>
          </g>
        }

        @for (pk of packets; track $index) {
          <circle class="packet" [class.packet--back]="pk.back" r="3.2">
            <animateMotion [attr.dur]="pk.dur" [attr.begin]="pk.begin" repeatCount="indefinite"
              [attr.keyPoints]="pk.back ? '1;0' : '0;1'" keyTimes="0;1" calcMode="linear">
              <mpath [attr.href]="'#' + pk.path" />
            </animateMotion>
          </circle>
        }
      </svg>

      <p class="map__log" aria-live="off">
        <span class="map__prompt">&gt;</span>
        <span class="map__key">{{ key() }}</span>
        <span>{{ typed() }}</span><i class="caret"></i>
        <span class="map__ok" [class.is-on]="ok()">✓</span>
      </p>
    </div>
  `,
})
export class SystemMap {
  private readonly motion = inject(MotionService);
  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');

  protected readonly nodes: Node[] = [
    { x: 16, y: 16, w: 180, h: 64, label: 'Client web', sub: 'Angular · HTML · CSS' },
    { x: 224, y: 16, w: 180, h: 64, label: 'Mobile', sub: 'Flutter · Java Android' },
    { x: 100, y: 138, w: 220, h: 64, label: 'API REST', sub: 'Spring Boot · Laravel', core: true },
    { x: 120, y: 260, w: 180, h: 64, label: 'Données', sub: 'MySQL · Oracle' },
  ];

  protected readonly paths = [
    { id: 'w-web', d: 'M106 80 C106 112 170 106 170 138' },
    { id: 'w-mob', d: 'M314 80 C314 112 250 106 250 138' },
    { id: 'w-db', d: 'M210 202 L210 260' },
  ];

  protected readonly packets = [
    { path: 'w-web', dur: '2.4s', begin: '0s', back: false },
    { path: 'w-web', dur: '2.4s', begin: '1.2s', back: true },
    { path: 'w-mob', dur: '2.8s', begin: '0.6s', back: false },
    { path: 'w-mob', dur: '2.8s', begin: '2s', back: true },
    { path: 'w-db', dur: '1.6s', begin: '0.3s', back: false },
    { path: 'w-db', dur: '1.6s', begin: '1.1s', back: true },
  ];

  protected readonly key = signal<string>(LOG[0][0]);
  protected readonly typed = signal<string>(LOG[0][1]);
  protected readonly ok = signal(true);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (this.motion.reduced) {
        this.svg().nativeElement.pauseAnimations?.();
        return;
      }

      let line = 0;
      let char = 0;
      let hold = 0;
      this.typed.set('');
      this.ok.set(false);

      const id = setInterval(() => {
        const [k, v] = LOG[line];
        if (char === 0) this.key.set(k);
        if (char < v.length) {
          char++;
          this.typed.set(v.slice(0, char));
          return;
        }
        if (!this.ok()) this.ok.set(true);
        if (++hold < 32) return;
        hold = 0;
        char = 0;
        line = (line + 1) % LOG.length;
        this.ok.set(false);
        this.typed.set('');
      }, 45);

      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected tilt(e: PointerEvent): void {
    if (this.motion.reduced || e.pointerType !== 'mouse') return;
    const el = this.card().nativeElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  }

  protected resetTilt(): void {
    this.card().nativeElement.style.transform = '';
  }
}
