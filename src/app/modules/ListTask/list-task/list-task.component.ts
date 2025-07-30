import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Task} from '../../../core/models/taskModels';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatIconAnchor, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {AuthService} from '../../../core/services/auth.service';
import {MatDialogComponent} from '../../../share/components/mat-dialog/mat-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {DragDropModule} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-list-task',
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MatIcon,
    MatIconButton,
    MatIconAnchor,
    RouterLink,
    FormsModule,
    MatInput,
    MatFormField,
    MatSelectModule,
    MatOptionModule,
    MatAnchor,
    CdkDropList,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.css'
})
export class ListTaskComponent {

  openPanelIndex: number | null = null;
  showInput = false;
  searchText = '';
  statusFilter: 'all' | 'completed' | 'incompleted' = 'all';

  tasks: Task[] = [];


  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    // console.log('New order:', this.filteredTasks);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.loadTasksFromLocalStorage();
  }

  logout(): void {
    this.authService.logout();
  }

  loadTasksFromLocalStorage() {
    const data = localStorage.getItem('tasks');
    try {
      const parsed = JSON.parse(data || '[]');
      this.tasks = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      this.tasks = [];
    }
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  putStatusTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasksToLocalStorage();
  }

  deleteTask(id: number) {
    const dialogRef = this.dialog.open(MatDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete the task ? ',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // console.log('Confirmed!');
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToLocalStorage();
      } else {
        // console.log('Cancelled');
      }
    });
  }

  toggleSearch() {
    this.showInput = !this.showInput;
  }

  togglePanel(index: number) {
    if (this.openPanelIndex === index) {
      this.openPanelIndex = null;
    } else {
      this.openPanelIndex = index;
    }
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'completed' && task.completed) ||
        (this.statusFilter === 'incompleted' && !task.completed);

      return matchesTitle && matchesStatus;
    });
  }
}
