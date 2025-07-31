import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {FormBuilderNewComponent} from '../../../share/components/form-builder-new/form-builder-new.component';
import {ApiService} from '../../../core/services/api.service';
import {HttpClientModule} from '@angular/common/http';
import {Task} from '../../../core/models/taskModels';
import {UsersService} from '../../../core/services/users.service';

@Component({
  selector: 'app-add-task',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormBuilderNewComponent,
    HttpClientModule
  ],
  providers: [ApiService, UsersService],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  data!: Task;
  callerStatus: any = {closed: true};

  formItem: any[] = [
    {
      type: 'readOnly',
      label: 'id',
      formControlName: 'id',
      validators: [Validators.required],
      hint: null,
      options: null,
      required: true,
      isMultiple: null,
      dirLtr: true,
      disabled: true,
      classList: 'col-12 col-md-1 card-none pt-3',
    },
    {
      type: 'text',
      label: 'title',
      formControlName: 'title',
      validators: [Validators.required],
      hint: null,
      options: null,
      required: true,
      isMultiple: null,
      dirLtr: true,
      classList: 'col-12 col-md-8 card-none pt-3',
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
      validators: [],
      hint: null,
      required: false,
      isMultiple: null,
      dirLtr: true,
      classList: 'col-12 col-md-3 card-none pt-3',
    },
    {
      type: 'textarea',
      label: 'description',
      formControlName: 'description',
      validators: [],
      hint: null,
      options: null,
      required: false,
      isMultiple: null,
      dirLtr: true,
      classList: 'col-12 col-md-12 card-none pt-3',
    },
    {
      type: 'hidden',
      formControlName: 'assigned',
    },
    {
      type: 'toggle',
      label: 'completed',
      formControlName: 'completed',
      validators: [],
      hint: null,
      options: null,
      required: false,
      isMultiple: null,
      dirLtr: true,
      classList: 'col-12 col-md-6 card-none pt-3 d-flex align-items-center justify-content-around',
    },
  ];

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadUsers();
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


  addTask(event: any) {
    this.data = event.value;
    const task = JSON.parse(localStorage.getItem('tasks') || '[]');
    const maxId = task.length ? Math.max(...task.map((t: { id: any; }) => t.id || 0)) : 0;
    this.data.id = maxId + 1;
    // console.log(this.data);
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const title = task.find((t: Task) => t.title === this.data.title);

    if (title) {
      this.snackBar.open('Repetitive task', '', {
        duration: 3000,
        horizontalPosition: 'center',
      });
    }else {
      tasks.push(this.data);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.snackBar.open('Task Added', '', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      this.router.navigate(['/tasks']);
    }
  }
}
