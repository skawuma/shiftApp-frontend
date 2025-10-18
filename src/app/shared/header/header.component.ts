import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="logo-container">
        <img src="https://evergreen-center.org/wp-content/uploads/2019/09/evergreen_logo.png" alt="Evergreen Center Logo" />
      </div>
      <h1 class="app-title">Shift Request Portal</h1>
    </header>
    
    
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo-container img {
      height: 50px;
      width: auto;
      margin-right: 12px;
    }

    .app-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: #00693e; /* Evergreen green tone */
      letter-spacing: 0.5px;
    }

    @media (max-width: 600px) {
      .app-title { font-size: 1.2rem; }
      .logo-container img { height: 40px; }
    }
  `]
})
export class HeaderComponent {

}
