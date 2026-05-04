import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { Auth } from './servicves/auth';

describe('AppComponent', () => {
  let auth: { isLoggedIn: jasmine.Spy; logout: jasmine.Spy };

  beforeEach(async () => {
    auth = jasmine.createSpyObj('Auth', ['isLoggedIn', 'logout']);
    auth.isLoggedIn.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: Auth, useValue: auth }],
    }).compileComponents();
  });

  it('should create the app shell', () => {
    const fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the application title', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Shift Request App');
  });
});
