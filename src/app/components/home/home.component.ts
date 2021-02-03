import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo, TodoStatus } from 'src/app/models/todo.model';
import { TodoQuery } from 'src/app/state/query';
import { TodoStore } from 'src/app/state/store';
import { take, filter, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = false;
  todos: Todo[] = [];

  constructor(
    private router: Router,
    private todoQuery: TodoQuery,
    private todoStore: TodoStore,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.todoQuery.getIsLoading().subscribe((res) => {
      this.loading = res;
    });

    this.todoQuery.getTodos().subscribe((res) => {
      this.todos = res;
    });

    this.todoQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.todoStore.setLoading(true);
        return this.apiService.getTodos();
      })
    ).subscribe((res) => {
      this.todoStore.update(state => {
        return {
          todos: res,
          isLoaded: true
        };
      });

      this.todoStore.setLoading(false);
    }, error => {
      console.log(error);
      this.todoStore.setLoading(false);
    });
  }

  addTodo(): void {
    this.router.navigate(['/add-todo']);
  }

  markAsComplete(id: string): void {
    this.apiService.updateTodo(id, { status: TodoStatus.DONE }).subscribe(() => {
      this.todoStore.update(state => {
        const todos = [ ...state.todos ];
        const index = todos.findIndex((todo) => {
          return todo._id === id;
        });

        todos[index] = {
          ...todos[index],
          status: TodoStatus.DONE
        };

        return {
          ...state,
          todos: todos
        };
      });
    }, (error) => {
      console.log(error);
    });
  }

  deleteTodo(id: string): void {
    this.apiService.deleteTodo(id).subscribe(() => {
      this.todoStore.update(state => {
        let todos = [ ...state.todos ];
        todos = todos.filter((todo) => {
          return todo._id !== id;
        });

        return {
          ...state,
          todos: todos
        };
      });
    }, error => {
      console.log(error);
    })
  }

}
