import { Routes } from "@angular/router";
import { AddTodoComponent } from "./components/add-todo/add-todo.component";
import { HomeComponent } from "./components/home/home.component";

export const ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'add-todo',
        component: AddTodoComponent
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/'
    }
];
