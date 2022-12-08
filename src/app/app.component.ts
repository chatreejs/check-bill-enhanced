import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

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
      const updatesAvailable = swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      );
      updatesAvailable.subscribe(() => {
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
