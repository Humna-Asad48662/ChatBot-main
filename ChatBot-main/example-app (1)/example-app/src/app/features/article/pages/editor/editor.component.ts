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
  articleForm: FormGroup;
  errors: any = {};
  isSubmitting = false;
  chatHistory: QueryHistory[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private queryLLMService: QueryLLMService,
    private queryHistoryService: QueryHistoryService
  ) {
    this.articleForm = this.fb.group({
      body: '',
      response: ''
    });
  }

  ngOnInit(): void {
    this.loadChatHistory();
  }

  deleteChatHistory(id: number): void {
    this.queryHistoryService.delete(id).subscribe(() => {
      this.loadChatHistory();
    });
  }

  loadChatHistory(): void {
    this.queryHistoryService.getAll().subscribe((history) => {
      this.chatHistory = history;
    });
  }

  submitForm(): void {
    this.isSubmitting = true;
    const query = this.articleForm.get('body')?.value;

    this.queryLLMService.query(query).subscribe(
      (response) => {
        this.articleForm.patchValue({ response: response.choices[0].message.content });
        this.saveQueryHistory(query, response.choices[0].message.content);
        this.isSubmitting = false;
      },
      (err) => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }

 // #write a function to clear query and response text areas after getting rrsponse from llm and populating chat history
  clearTextAreas(): void {
    this.articleForm.patchValue({ body: '' });
    this.articleForm.patchValue({ response: '' });
  }

  saveQueryHistory(query: string, answer: string): void {
    const newHistory: QueryHistory = {
      id: 0, // Assuming the backend will generate the ID
      query: query,
      answer: answer,
      isActive: true,
      createdDate: new Date()
    };

    this.queryHistoryService.add(newHistory).subscribe(() => {
      this.loadChatHistory();
    });
  }
}

