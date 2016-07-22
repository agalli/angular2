import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from './hero.service';

import { Hero } from './hero';


@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/hero-detail.component.html',
  styleUrls: ['app/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  @Input()
  hero: Hero;
  @Output()
  close = new EventEmitter();

  sub: any;
  navigated = false;
  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.heroService.getHero(id)
          .then(hero => this.hero = hero);
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  save() {
    this.heroService
      .save(this.hero)
      .then(hero => {
        this.hero = hero; // saved hero, w/ id if new
        this.goBack(hero);
      })
      .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedHero: Hero = null) {
    this.close.emit(savedHero);
    if (this.navigated) { window.history.back(); }
  }
    private error(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

/*  goBack() {
    window.history.back();
  }*/

}
