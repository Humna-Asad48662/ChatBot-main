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

interface ArticleForm {
  body: FormControl<string>;
  response: FormControl<string>;
}

interface ChatHistoryItem {
  query: string;
  response: string;
}

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
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    body: new FormControl("", { nonNullable: true }),
    response: new FormControl("", { nonNullable: true }),
  });


  isSubmitting = false;
  errors: any = {};
  queries: QueryHistory[] = [];
  queryHistory: QueryHistory = {
    id: 0,
    query: "",
    answer: "",
    createdDate: new Date(),
    isActive: true

  };
  chatHistory: ChatHistoryItem[] = []; // 
  constructor(
    private fb: FormBuilder,
    private readonly articleService: QueryLLMService,
    private readonly queryHistoryService: QueryHistoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) 
  {
    this.articleForm = this.fb.group({
      body: '',
      response: ''
    });
    this.loadDataHistory();
  }

  ngOnInit(): void {

  }

  loadDataHistory(): void {

    this.queryHistoryService.getAll().subscribe((data) => {
      this.queries = data;
    });
  }

  deleteChat(id: number): void {
    this.queryHistoryService.delete(id).subscribe((data) => {
      console.log(data);
      this.loadDataHistory();
  }
  );}

 //write a function to clear text areas
  clearForm(): void {
    this.articleForm.patchValue({
      body: '',
      response: ''
    });
    this.focusTextarea();
  }


  submitForm(): void {
    this.isSubmitting = true;
    const query = this.articleForm.get('body')?.value;

    var response = '';
    this.articleService
      .query(this.articleForm.value.body)
      .subscribe(
        (response) => {
          if (response['choices'][0]?.message?.content != undefined) {
            this.articleForm.value.response = response['choices'][0].message.content;
            this.articleForm.patchValue({
              response: this.articleForm.value.response
            }); this.focusTextarea();

            this.queryHistory.query = this.articleForm.value.body;
            this.queryHistory.answer = this.articleForm.value.response;
            this.queryHistoryService.add(this.queryHistory).subscribe((data) => {
              console.log(data);
              this.loadDataHistory();
              
            });


          }
          this.isSubmitting = false;
        },
      );

  }
  loadChat(id: number): void {
    this.queryHistoryService.getById(id).subscribe((chat) => {
      this.articleForm.patchValue({
        body: chat.query,
        response: chat.answer,
      });
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
