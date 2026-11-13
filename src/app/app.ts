import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { Preloader } from './layout/preloader';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { EducationSection } from './sections/education/education';
import { ExperienceSection } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { Stack } from './sections/stack/stack';

@Component({
  selector: 'app-root',
  imports: [Preloader, Header, Footer, Hero, About, Stack, Projects, ExperienceSection, EducationSection, Contact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Aller au contenu</a>
    <app-preloader />
    <app-header />
    <main id="main">
      <app-hero />
      <app-about />
      <app-stack />
      <app-projects />
      <div id="parcours">
        <app-experience />
        <app-education />
      </div>
      <app-contact />
    </main>
    <app-footer />
  `,
})
export class App {}
