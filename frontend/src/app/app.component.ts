import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidenavComponent],
  template: `
    <app-sidenav *ngIf="showSidenav">
      <router-outlet></router-outlet>
    </app-sidenav>
    <router-outlet *ngIf="!showSidenav"></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = 'Ecommerce';
  showSidenav = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.updateSidenavVisibility(this.router.url);

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateSidenavVisibility(event.url);
    });
  }

  private updateSidenavVisibility(url: string): void {
    this.showSidenav = url.includes('/products') || url.includes('/checkout') || url.includes('/success');
  }
}
