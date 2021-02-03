import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TodoStore } from 'src/app/state/store';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {

  todoForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private todoStore: TodoStore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.todoForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }

  addTodo(): void {
    console.log(this.todoForm.value);

    this.todoStore.setLoading(true);
    this.apiService.addTodo(this.todoForm.controls['title'].value, 
    this.todoForm.controls['description'].value).subscribe(res => {
      this.todoStore.update(state => {
        return {
          todos: [
            ...state.todos, res
          ]
        }
      });

      this.todoStore.setLoading(false);
      this.router.navigate(['/']);
    });
  }

}
