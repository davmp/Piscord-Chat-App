import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormGroup,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { AuthService } from "../../../services/auth/auth.service";
import { buttonThemes, inputThemes } from "../../../themes/form.themes";

@Component({
  selector: "app-register",
  imports: [
    ButtonModule,
    PasswordModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  registerForm: FormGroup;

  outlined = inputThemes.outlined;
  ghost = buttonThemes.ghost;

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      profileUrl: [""],
      password: [
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.required,
        ]),
      ],
      confirmPassword: [
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.required,
        ]),
      ],
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl("/");
    }
  }

  register() {
    const val = this.registerForm.value;

    if (val.username && val.password && val.password === val.confirmPassword) {
      const registerRequest = {
        username: val.username,
        picture: val.profileUrl,
        password: val.password,
      };
      this.authService.register(registerRequest).subscribe(() => {
        this.router.navigateByUrl("/");
      });
    }
  }
}
