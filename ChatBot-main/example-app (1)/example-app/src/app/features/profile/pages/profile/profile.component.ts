import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { combineLatest, of, throwError } from "rxjs";
import { Profile } from "../../models/profile.model";
import { ProfileService } from "../../services/profile.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FollowButtonComponent } from "../../components/follow-button.component";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile.component.html",
  imports: [
    FollowButtonComponent,
    NgIf,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,
    RouterOutlet,
    FollowButtonComponent,
  ],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
  }

  onToggleFollowing(profile: Profile) {
    this.profile = profile;
  }
}
