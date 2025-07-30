import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-tasks-container',
  imports: [
    RouterOutlet
  ],
  templateUrl: './tasks-container.component.html',
  styleUrl: './tasks-container.component.css'
})
export class TasksContainerComponent {

}
