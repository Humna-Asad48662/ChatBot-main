import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ListErrorsComponent } from "../../shared/components/list-errors.component";
import { Errors } from "../../core/models/errors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface SettingsForm {
  image: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings.component.html",
  imports: [ListErrorsComponent, ReactiveFormsModule],
  standalone: true,
})
export default class SettingsComponent implements OnInit {
  settingsForm = new FormGroup<SettingsForm>({
    image: new FormControl("", { nonNullable: true }),
    username: new FormControl("", { nonNullable: true }),
    bio: new FormControl("", { nonNullable: true }),
    email: new FormControl("", { nonNullable: true }),
    password: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  errors: Errors | null = null;
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
  }

  logout(): void {
  }

  submitForm() {
    this.isSubmitting = true;
  }
}
