import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { ProfileService } from "../services/profile.service";
import { Profile } from "../models/profile.model";
import { NgClass } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-follow-button",
  template: `
    <button
      class="btn btn-sm action-btn"
      [ngClass]="{
        disabled: isSubmitting,
        'btn-outline-secondary': !profile.following,
        'btn-secondary': profile.following
      }"
      (click)="toggleFollowing()"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ profile.following ? "Unfollow" : "Follow" }} {{ profile.username }}
    </button>
  `,
  imports: [NgClass],
  standalone: true,
})
export class FollowButtonComponent {
  @Input() profile!: Profile;
  @Output() toggle = new EventEmitter<Profile>();
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
  ) { }

  toggleFollowing(): void {
    this.isSubmitting = true;
  }
}
