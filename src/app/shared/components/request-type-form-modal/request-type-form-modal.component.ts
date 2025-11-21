import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestType, RequestTypeRequest } from '../../../interfaces/request-type.interface';
import { RequestTypeService } from '../../../services/request-type.service';
import { NotificationService } from '../../../services/notification.service';

export interface RequestTypeFormModalData {
  requestType?: RequestType;
}

@Component({
  selector: 'app-request-type-form-modal',
  templateUrl: './request-type-form-modal.component.html',
  styleUrls: ['./request-type-form-modal.component.scss']
})
export class RequestTypeFormModalComponent implements OnInit {
  requestTypeForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<RequestTypeFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestTypeFormModalData,
    private fb: FormBuilder,
    private requestTypeService: RequestTypeService,
    private notificationService: NotificationService
  ) {
    this.requestTypeForm = this.fb.group({
      id: [''],
      dateCreated: [''],
      rowVersion: [''],
      name: ['', [Validators.required]],
      template: ['', [Validators.required]],
      isDeleted: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.data?.requestType) {
      this.isEditMode = true;
      this.requestTypeForm.patchValue({
        id: this.data.requestType.id,
        dateCreated: this.data.requestType.dateCreated,
        rowVersion: this.data.requestType.rowVersion,
        name: this.data.requestType.name,
        template: this.data.requestType.template,
        isDeleted: this.data.requestType.isDeleted,
        isActive: this.data.requestType.isActive
      });
    } else {
      this.requestTypeForm.patchValue({
        dateCreated: new Date().toISOString()
      });
    }
  }

  onSubmit(): void {
    if (this.requestTypeForm.valid) {
      if (this.isEditMode) {
        this.updateRequestType();
      } else {
        this.createRequestType();
      }
    } else {
      this.requestTypeForm.markAllAsTouched();
    }
  }

  createRequestType(): void {
    this.loading = true;
    const { id, ...requestTypeDataWithoutId } = this.requestTypeForm.value;
    requestTypeDataWithoutId.isActive = true; // Siempre true
    
    this.requestTypeService.createRequestType(requestTypeDataWithoutId as any).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Tipo de solicitud creado exitosamente');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  updateRequestType(): void {
    this.loading = true;
    const requestTypeData: RequestTypeRequest = this.requestTypeForm.value;
    requestTypeData.isActive = true; // Siempre true
    
    this.requestTypeService.updateRequestType(requestTypeData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Tipo de solicitud actualizado exitosamente');
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
    return this.requestTypeForm.get('name');
  }

  get template() {
    return this.requestTypeForm.get('template');
  }
}

