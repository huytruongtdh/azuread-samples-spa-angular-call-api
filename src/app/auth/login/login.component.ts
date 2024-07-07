import { Component } from '@angular/core';
import { AuthService, LoginMode } from '../../_services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoggedIn = false;
  userName: string | null = null;
  loginForm!: FormGroup;

  get LoginMode(): LoginMode {
    return this.LoginMode;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl('/');
      return;
    }

    this.loginForm = new FormGroup({
      username: new FormControl('huycrt@gmail.com'),
      password: new FormControl('Huy@123'),
    });
  }

  ngOnInit(): void {
  }

  loginPassword(): void {
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    if (!username || !password) {
      alert('Username or password is required!');
      return;
    }

    this.authService.loginWithPassword(username, password)
      .subscribe({
        next: (res) => {
          console.log(res);
          const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
          this.router.navigateByUrl(returnUrl || '/');
        },
        error: (err) => {
          console.log(err);
          alert('Login failed!');
        },
      });
  }

  loginAzureAD() {
    this.authService.loginWithAzureAd();
  }
  loginGoogle() {
    this.authService.loginWithGoogle();
  }
  loginFacebook() {
    this.authService.loginWithFacebook();
  }

  logout(): void {
    this.authService.logout();
  }
}
