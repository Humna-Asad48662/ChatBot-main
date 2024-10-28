import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../models/comment.model";
import { QueryHistory } from "../models/queryHistory.model";

@Injectable({ providedIn: "root" })
export class QueryHistoryService {
  webUrl: string = "https://localhost:7088/";
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<QueryHistory[]> {
    return this.http
      .get<QueryHistory[]>(this.webUrl +`api/QueryHistory/GetAll`)
      .pipe(map((data) => data));
  }

  getById(id: number): Observable<QueryHistory> {
    return this.http
      .get<QueryHistory>(this.webUrl +`api/QueryHistory/` + id)
      .pipe(map((data) => data));
  }

  add(queryHistory: QueryHistory): Observable<boolean> {
    return this.http
      .post<boolean>(`api/QueryHistory`, {
        queryHistory,
      })
      .pipe(map((data) => data));
  }
  
  update(queryHistory: QueryHistory): Observable<boolean> {
    return this.http
      .put<boolean>(`api/QueryHistory`, {
        queryHistory,
      })
      .pipe(map((data) => data));
  }

  delete(id: number): Observable<boolean> {
    return this.http
      .delete<boolean>(this.webUrl +`api/QueryHistory/` + id)
      .pipe(map((data) => data));
  }
}
