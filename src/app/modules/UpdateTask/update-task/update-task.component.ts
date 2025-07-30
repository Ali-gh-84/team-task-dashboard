import {Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilderNewComponent} from '../../../share/components/form-builder-new/form-builder-new.component';
import {Task} from '../../../core/models/taskModels';
import {ApiService} from '../../../core/services/api.service';
import {UsersService} from '../../../core/services/users.service';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [FormBuilderNewComponent, HttpClientModule],
  providers: [ApiService, UsersService],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css'
})
export class UpdateTaskComponent implements OnInit {

  data!: any;
  callerStatus: any = {closed: true};

  @ViewChild(FormBuilderNewComponent)
  formBuilderComponent!: FormBuilderNewComponent;

  formItem: any[] = [
    {
      type: 'readOnly',
      label: 'id',
      formControlName: 'id',
      validators: [Validators.required],
      disabled: true,
      classList: 'col-12 col-md-1 card-none pt-3',
    },
    {
      type: 'text',
      label: 'title',
      formControlName: 'title',
      validators: [Validators.required],
      classList: 'col-12 col-md-6 card-none pt-3',
    },
    {
      type: 'select',
      label: 'priority',
      formControlName: 'priority',
      options: [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'},
      ],
      validators: [Validators.required],
      classList: 'col-12 col-md-5 card-none pt-3',
    },
    {
      type: 'textarea',
      label: 'description',
      formControlName: 'description',
      classList: 'col-12 col-md-12 card-none pt-3',
    },
    {
      type: 'hidden',
      formControlName: 'assigned',
    },
    {
      type: 'select',
      label: 'completed',
      formControlName: 'completed',
      options: [
        {name: 'completed', value: 'true'},
        {name: 'incompleted', value: 'false'},
      ],
      validators: [Validators.required],
      classList: 'col-12 col-md-6 card-none pt-3',
    },
  ];

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask(id);
    this.loadUsers();
  }

  loadTask(id: number): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find((t: Task) => Number(t.id) === id);

    if (!task) {
      this.snackBar.open('Task not found', '', {duration: 3000});
      this.router.navigate(['/tasks']);
      return;
    }

    setTimeout(() => {
      this.data = task;
      this.formBuilderComponent?.form?.patchValue(task);
    }, 0);
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      const userOptions = users.map(user => ({
        name: user.name,
        value: user.name,
      }));

      const assignedField = {
        type: 'select',
        label: 'assigned',
        formControlName: 'assigned',
        options: userOptions,
        validators: [Validators.required],
        classList: 'col-12 col-md-6 pt-3',
      };

      this.formItem = [
        ...this.formItem.filter(f => f.formControlName !== 'assigned'),
        assignedField
      ];
    });
  }

  updateTask(event: any): void {
    const updatedTask = {
      ...event.value,
      id: this.data.id
    };

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const index = tasks.findIndex((t: Task) => t.id === updatedTask.id);

    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.snackBar.open('Task updated !', '', {duration: 3000});
      this.router.navigate(['/tasks']);
    } else {
      this.snackBar.open('Task not found!', '', {duration: 3000});
    }
  }
}
