import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';

/** Heure locale en direct pour un fuseau donné (ex. Africa/Lome). */
@Component({
  selector: 'app-local-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<time>{{ now() }}</time>`,
})
export class LocalTime {
  readonly zone = input('Africa/Lome');
  readonly seconds = input(false);
  protected readonly now = signal('');

  constructor() {
    const tick = () => {
      try {
        this.now.set(
          new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: this.seconds() ? '2-digit' : undefined,
            timeZone: this.zone(),
          }).format(new Date()),
        );
      } catch {
        this.now.set('');
      }
    };
    queueMicrotask(tick);
    const id = setInterval(tick, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
