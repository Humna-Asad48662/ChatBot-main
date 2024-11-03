import { NgForOf } from "@angular/common";
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Errors } from "../../../../core/models/errors.model";
import { QueryLLMService } from "../../services/queryLLM.service";
import { ListErrorsComponent } from "../../../../shared/components/list-errors.component";
import { QueryHistoryService } from "../../services/queryHistory.service";
import { QueryHistory } from "../../models/queryHistory.model";
import { identity, timeInterval } from "rxjs";

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor.component.html",
  styleUrls: ['./editor.component.css'],
  imports: [ListErrorsComponent, ReactiveFormsModule, NgForOf],
  standalone: true,
})
export default class EditorComponent implements OnInit {
  tagList: string[] = [];
  response: string = "";
  @ViewChild('response') bodyTextarea!: ElementRef;
  articleForm: UntypedFormGroup = new FormGroup({
    body: new FormControl(""),
    response: new FormControl(""),
  });
  
  isSubmitting = false;
  errors: any = {};
  queryHistory: QueryHistory[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly articleService: QueryLLMService,
    private readonly queryHistoryService: QueryHistoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadQueryHistory();
  }

  submitForm(): void {
    this.isSubmitting = true;
    const query = this.articleForm.get('body')?.value;

    this.articleService.query(query).subscribe((response) => {
      if (response['choices'][0]?.message?.content != undefined) {
        const responseText = response['choices'][0].message.content;
        this.articleForm.patchValue({ response: responseText });
        this.focusTextarea();

        // Save query and response to history
        const queryHistory: QueryHistory = {
          id: 0, // Assuming the backend will generate the ID
          query: query,
          answer: responseText,
          isActive: true,
          createdDate: new Date()
        };
        this.queryHistoryService.add(queryHistory).subscribe(() => {
          this.loadQueryHistory();
        });
      }
      this.isSubmitting = false;
    });
  }

  loadQueryHistory(): void {
    this.queryHistoryService.getAll().subscribe((history) => {
      this.queryHistory = history;
    });
  }

  focusTextarea(): void {
    const textarea: HTMLTextAreaElement = this.bodyTextarea.nativeElement;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

