import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { Observable, shareReplay, tap } from "rxjs";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../models/auth.models";
import type { Profile, UpdateProfileRequest } from "../../models/user.models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly authApiUrl = "http://localhost:8000/api";
  private readonly profileApiUrl = "http://localhost:8000/api/profile";
  private readonly platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  profile = signal<Profile | null>(null);

  constructor() {
    this.getProfile();
  }

  getProfile() {
    return this.http.get<Profile>(this.profileApiUrl).pipe(
      tap((profile) => {
        this.profile.set(profile);
        this.setProfile(profile);
      })
    );
  }

  updateProfile(data: Partial<UpdateProfileRequest>) {
    return this.http.put<Profile>(this.profileApiUrl, data).pipe(
      tap((profile) => {
        this.profile.set(profile);
        this.setProfile(profile);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/login`, data)
      .pipe(
        tap((res) => {
          this.setSession(res);
          this.profile.set(res.user);
        }),
        shareReplay()
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/auth/register`, data)
      .pipe(
        tap((res) => {
          this.setSession(res);
          this.profile.set(res.user);
        }),
        shareReplay()
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token");
    }
    return null;
  }

  private setProfile(user: Profile) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private setSession(authResult: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("token", authResult.token);
      localStorage.setItem("user", JSON.stringify(authResult.user));
    }
  }
}
