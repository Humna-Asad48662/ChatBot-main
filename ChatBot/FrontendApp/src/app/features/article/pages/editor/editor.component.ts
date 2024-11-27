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

interface ChatEntry {
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
  @ViewChild('chatHistory') chatHistory!: ElementRef;
  articleForm: UntypedFormGroup = new FormGroup({
    body: new FormControl(""),
  });
  chatEntries: ChatEntry[] = [];
  isSubmitting = false;
  errors: any = {};

  constructor(
    private fb: FormBuilder,
    private readonly articleService: QueryLLMService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  submitForm(): void {
    this.isSubmitting = true;
    const query = this.articleForm.get('body')?.value;

    this.articleService.query(query).subscribe((response) => {
      if (response['choices'][0]?.message?.content != undefined) {
        const responseText = response['choices'][0].message.content;
        this.chatEntries.push({ query, response: responseText });
        this.articleForm.reset();
        this.scrollToBottom();
      }
      this.isSubmitting = false;
    });
  }
 deleteChatHistory(): void {
    this.chatEntries = [];
  }

  //write the function to refresh the page
  refreshPage(): void {
    window.location.reload();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    }, 0);
  }
}

