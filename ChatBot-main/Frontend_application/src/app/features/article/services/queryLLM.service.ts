import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: "root" })
export class QueryLLMService {
  
  constructor(private readonly http: HttpClient) {}

  query(query: string): Observable<any> {
    const web_base_urll : string = "https://cmpautomation.openai.azure.com";
    const deploymentId : string = "VGAIGPT4o";
    var message = [
      {
        role : "user",
        content: query
      }
    ];
    var variableToPost = {
      messages: message
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'api-key': '5713639c4514446286c251feaca0910b' });
  let options = { headers: headers };

    return this.http
      .post<any>(web_base_urll + "/openai/deployments/"+deploymentId+"/chat/completions?api-version=2023-03-15-preview", { messages: message }, options);
  }

}
