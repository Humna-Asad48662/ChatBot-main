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

  chatHistory: { query: string; response: string }[] = [];
  isSubmitting = false;
  errors: any = {};

  constructor(
    private fb: FormBuilder,
    private readonly articleService: QueryLLMService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.articleForm = this.fb.group({
      body: '',
      response: ''
    });
  }

  ngOnInit(): void {
    
  }

  deleteHistoryItem(index: number): void {
    this.chatHistory.splice(index, 1);
  }
  
  //clear the text areas
  clear(): void {
    this.articleForm.patchValue({ body: '', response: '' });
  }
   
  //refresh page
  refresh(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/editor']);
    });
  }

  submitForm(): void {
    this.isSubmitting = true;
    const query = this.articleForm.get('body')?.value;

    this.articleService.query(query).subscribe((response) => {
      if (response['choices'][0]?.message?.content != undefined) {
        const responseText = response['choices'][0].message.content;
        this.articleForm.patchValue({ response: responseText });
        this.focusTextarea();

        // Add to chat history
        this.chatHistory.push({ query, response: responseText });
      }
      this.isSubmitting = false;
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

