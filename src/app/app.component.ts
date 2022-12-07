import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private currentUrl: string = '/';

  get showBackButton(): boolean {
    return this.currentUrl !== '/';
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private location: Location,
    private swUpdate: SwUpdate,
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(() => {
        window.location.reload();
      });
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }

  goBack(): void {
    this.location.back();
  }
}
