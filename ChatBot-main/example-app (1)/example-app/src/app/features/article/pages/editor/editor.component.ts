import { NgForOf } from "@angular/common";
import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { Errors } from "../../../../core/models/errors.model";
import { QueryLLMService } from "../../services/queryLLM.service";
import { ListErrorsComponent } from "../../../../shared/components/list-errors.component";

interface ArticleForm {
  body: FormControl<string>;
  response: FormControl<string>;
}

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor.component.html",
  imports: [ListErrorsComponent, ReactiveFormsModule, NgForOf],
  standalone: true,
})
export default class EditorComponent implements OnInit {
  tagList: string[] = [];
  response: string = "";
  @ViewChild('response') bodyTextarea!: ElementRef;
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    body: new FormControl("", { nonNullable: true }),
    response: new FormControl("", { nonNullable: true }),
  });

  errors: Errors | null = null;
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly articleService: QueryLLMService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit() {

  }

  submitForm(): void {
    this.isSubmitting = true;
    this.response = '';

    // post the changes
    this.articleService
      .query(this.articleForm.value.body)
      .subscribe(
        (response) => {
          if (response['choices'][0]?.message?.content != undefined) {
            this.response = response['choices'][0].message.content;
            this.articleForm.patchValue({
              response: this.response
            });
            this.focusTextarea();
          }
          this.isSubmitting = false;
        },
      );
  }
  focusTextarea(): void {
    const textarea: HTMLTextAreaElement = this.bodyTextarea.nativeElement;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
