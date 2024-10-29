import { NgForOf } from "@angular/common";
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Errors } from "../../../../core/models/errors.model";
import { QueryLLMService } from "../../services/queryLLM.service";
import { ListErrorsComponent } from "../../../../shared/components/list-errors.component";
import { QueryHistoryService } from "../../services/queryHistory.service";
import { QueryHistory } from "../../models/queryHistory.model";

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

  //articleForm: FormGroup;

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
  chatHistory: ChatHistoryItem[] = []; // Use the interface here


  // @ViewChild('response') bodyTextarea!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private readonly articleService: QueryLLMService,
    private readonly queryHistoryService: QueryHistoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
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

            // Add to chat history
            //this.chatHistory.push({ query, response: response['choices'][0].message.content });

            this.queryHistory.query = this.articleForm.value.body;
            this.queryHistory.answer = this.articleForm.value.response;
            this.queryHistoryService.add(this.queryHistory).subscribe((data) => {
              console.log(data);
            });


          }
          this.isSubmitting = false;
        },
      );

      
    this.loadDataHistory();


    // Simulate sending query to LLM and getting a response
    //const response = 'Simulated response from LLM';

    // Update the form with the response
    // this.articleForm.get('response')?.setValue(response);

    // // Add to chat history
    // this.chatHistory.push({ query, response });

    // this.queryHistory.query = this.articleForm.value.body;
    //         this.queryHistory.answer = this.response;
    //         this.queryHisotryService.add(this.queryHistory);

    // this.isSubmitting = false;
  }
  focusTextarea(): void {
    const textarea: HTMLTextAreaElement = this.bodyTextarea.nativeElement;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
