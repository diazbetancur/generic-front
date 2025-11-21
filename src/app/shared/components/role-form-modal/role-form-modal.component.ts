import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, RoleRequest } from '../../../interfaces/role.interface';
import { RoleService } from '../../../services/role.service';
import { NotificationService } from '../../../services/notification.service';

export interface RoleFormModalData {
  role?: Role;
}

@Component({
  selector: 'app-role-form-modal',
  templateUrl: './role-form-modal.component.html',
  styleUrls: ['./role-form-modal.component.scss']
})
export class RoleFormModalComponent implements OnInit {
  roleForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<RoleFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleFormModalData,
    private fb: FormBuilder,
    private roleService: RoleService,
    private notificationService: NotificationService
  ) {
    this.roleForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data?.role) {
      this.isEditMode = true;
      this.roleForm.patchValue({
        id: this.data.role.id,
        name: this.data.role.name,
        description: this.data.role.description
      });
    }
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      if (this.isEditMode) {
        this.updateRole();
      } else {
        this.createRole();
      }
    } else {
      this.roleForm.markAllAsTouched();
    }
  }

  createRole(): void {
    this.loading = true;
    const roleData: RoleRequest = {
      name: this.roleForm.value.name,
      description: this.roleForm.value.description
    };
    
    this.roleService.createRole(roleData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Rol creado exitosamente');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  updateRole(): void {
    this.loading = true;
    const roleData: RoleRequest = {
      id: this.roleForm.value.id,
      name: this.roleForm.value.name,
      description: this.roleForm.value.description
    };
    
    this.roleService.updateRole(roleData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Rol actualizado exitosamente');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get name() {
    return this.roleForm.get('name');
  }

  get description() {
    return this.roleForm.get('description');
  }
}

