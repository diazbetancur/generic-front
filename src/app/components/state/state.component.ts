import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { State } from '../../interfaces/state.interface';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { StateFormModalComponent } from '../../shared/components/state-form-modal/state-form-modal.component';
import { NotificationService } from '../../services/notification.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  states: State[] = [];
  paginatedStates: State[] = [];
  sortedStates: State[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private stateService: StateService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStates();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.sortData();
      });
    }
  }

  loadStates(): void {
    this.loading = true;
    this.stateService.getStates().subscribe({
      next: (states) => {
        this.states = states;
        this.sortedStates = [...states];
        this.sortData();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  sortData(): void {
    if (!this.sort || !this.sort.active) {
      this.sortedStates = [...this.states];
    } else {
      const data = [...this.states];
      const isAsc = this.sort.direction === 'asc';
      
      this.sortedStates = data.sort((a, b) => {
        switch (this.sort.active) {
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'hexColor':
            return this.compare(a.hexColor, b.hexColor, isAsc);
          default:
            return 0;
        }
      });
    }
    this.updatePaginatedStates();
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  updatePaginatedStates(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStates = this.sortedStates.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedStates();
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(StateFormModalComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadStates();
      }
    });
  }

  openEditForm(state: State): void {
    const dialogRef = this.dialog.open(StateFormModalComponent, {
      width: '550px',
      data: { state: state }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStates();
      }
    });
  }

  deleteState(id: string): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este estado? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.stateService.deleteState(id).subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Estado eliminado exitosamente');
            this.loadStates();
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
          }
        });
      }
    });
  }

}

