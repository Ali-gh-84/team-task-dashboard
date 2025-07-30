import {Routes} from '@angular/router';
import {LoginComponent} from './modules/Login/login/login.component';
import {loginGuard} from './core/guards/login.guard';
import {ListTaskComponent} from './modules/ListTask/list-task/list-task.component';
import {AddTaskComponent} from './modules/AddTask/add-task/add-task.component';
import {UpdateTaskComponent} from './modules/UpdateTask/update-task/update-task.component';
import {TasksContainerComponent} from './modules/TasksContainer/tasks-container/tasks-container.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'tasks',
    component: TasksContainerComponent,
    canActivate: [loginGuard],
    children: [
      {
        path: '',
        component: ListTaskComponent,
      },
      {
        path: 'new',
        component: AddTaskComponent,
      },
      {
        path: ':id/edit',
        component: UpdateTaskComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];
