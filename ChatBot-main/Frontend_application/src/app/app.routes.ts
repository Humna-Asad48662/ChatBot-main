import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs/operators";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/article/pages/editor/editor.component"),
  },
  {
    path: "editor",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/article/pages/editor/editor.component"),
      },
    ],
  },
];
