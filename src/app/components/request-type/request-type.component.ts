import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RequestType } from '../../interfaces/request-type.interface';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { RequestTypeFormModalComponent } from '../../shared/components/request-type-form-modal/request-type-form-modal.component';
import { NotificationService } from '../../services/notification.service';
import { RequestTypeService } from '../../services/request-type.service';

@Component({
  selector: 'app-request-type',
  templateUrl: './request-type.component.html',
  styleUrls: ['./request-type.component.scss']
})
export class RequestTypeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  requestTypes: RequestType[] = [];
  paginatedRequestTypes: RequestType[] = [];
  sortedRequestTypes: RequestType[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private requestTypeService: RequestTypeService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequestTypes();
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

  loadRequestTypes(): void {
    this.loading = true;
    this.requestTypeService.getRequestTypes().subscribe({
      next: (requestTypes) => {
        this.requestTypes = requestTypes;
        this.sortedRequestTypes = [...requestTypes];
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
      this.sortedRequestTypes = [...this.requestTypes];
    } else {
      const data = [...this.requestTypes];
      const isAsc = this.sort.direction === 'asc';
      
      this.sortedRequestTypes = data.sort((a, b) => {
        switch (this.sort.active) {
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'template':
            return this.compare(a.template, b.template, isAsc);
          default:
            return 0;
        }
      });
    }
    this.updatePaginatedRequestTypes();
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  updatePaginatedRequestTypes(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRequestTypes = this.sortedRequestTypes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedRequestTypes();
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(RequestTypeFormModalComponent, {
      width: '650px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadRequestTypes();
      }
    });
  }

  openEditForm(requestType: RequestType): void {
    const dialogRef = this.dialog.open(RequestTypeFormModalComponent, {
      width: '650px',
      data: { requestType: requestType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequestTypes();
      }
    });
  }

  deleteRequestType(id: string): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este tipo de solicitud? Esta acción no se puede deshacer.',
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
        this.requestTypeService.deleteRequestType(id).subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Tipo de solicitud eliminado exitosamente');
            this.loadRequestTypes();
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
