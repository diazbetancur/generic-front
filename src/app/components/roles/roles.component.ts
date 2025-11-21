import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Role } from '../../interfaces/role.interface';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { RoleFormModalComponent } from '../../shared/components/role-form-modal/role-form-modal.component';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  roles: Role[] = [];
  paginatedRoles: Role[] = [];
  sortedRoles: Role[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private roleService: RoleService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoles();
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

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.sortedRoles = [...roles];
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
      this.sortedRoles = [...this.roles];
    } else {
      const data = [...this.roles];
      const isAsc = this.sort.direction === 'asc';
      
      this.sortedRoles = data.sort((a, b) => {
        switch (this.sort.active) {
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'description':
            return this.compare(a.description, b.description, isAsc);
          default:
            return 0;
        }
      });
    }
    this.updatePaginatedRoles();
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  updatePaginatedRoles(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRoles = this.sortedRoles.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedRoles();
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(RoleFormModalComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadRoles();
      }
    });
  }

  openEditForm(role: Role): void {
    const dialogRef = this.dialog.open(RoleFormModalComponent, {
      width: '550px',
      data: { role: role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteRole(id: string): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este rol? Esta acción no se puede deshacer.',
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
        this.roleService.deleteRole(id).subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Rol eliminado exitosamente');
            this.loadRoles();
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
