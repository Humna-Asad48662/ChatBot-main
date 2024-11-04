import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Article } from "../../models/article.model";
import { ArticleMetaComponent } from "../../components/article-meta.component";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { MarkdownPipe } from "../../../../shared/pipes/markdown.pipe";
import { ListErrorsComponent } from "../../../../shared/components/list-errors.component";
import { ArticleCommentComponent } from "../../components/article-comment.component";
import { catchError } from "rxjs/operators";
import { combineLatest, throwError } from "rxjs";
import { Comment } from "../../models/comment.model";
import { Errors } from "../../../../core/models/errors.model";
import { Profile } from "../../../profile/models/profile.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FavoriteButtonComponent } from "../../components/favorite-button.component";
import { FollowButtonComponent } from "../../../profile/components/follow-button.component";

@Component({
  selector: "app-article-page",
  templateUrl: "./article.component.html",
  imports: [
    ArticleMetaComponent,
    RouterLink,
    NgClass,
    FollowButtonComponent,
    FavoriteButtonComponent,
    NgForOf,
    MarkdownPipe,
    AsyncPipe,
    ListErrorsComponent,
    FormsModule,
    ArticleCommentComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  standalone: true,
})
export default class ArticleComponent implements OnInit {
  article!: Article;
  comments: Comment[] = [];
  canModify: boolean = false;

  commentControl = new FormControl<string>("", { nonNullable: true });
  commentFormErrors: Errors | null = null;

  isSubmitting = false;
  isDeleting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    
  }

  onToggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  toggleFollowing(profile: Profile): void {
    this.article.author.following = profile.following;
  }

  deleteArticle(): void {
    this.isDeleting = true;

  }

}
