import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { State, StateRequest } from '../../../interfaces/state.interface';
import { StateService } from '../../../services/state.service';
import { NotificationService } from '../../../services/notification.service';

export interface StateFormModalData {
  state?: State;
}

@Component({
  selector: 'app-state-form-modal',
  templateUrl: './state-form-modal.component.html',
  styleUrls: ['./state-form-modal.component.scss']
})
export class StateFormModalComponent implements OnInit {
  stateForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<StateFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StateFormModalData,
    private fb: FormBuilder,
    private stateService: StateService,
    private notificationService: NotificationService
  ) {
    this.stateForm = this.fb.group({
      id: [''],
      dateCreated: [''],
      rowVersion: [''],
      name: ['', [Validators.required]],
      hexColor: ['', [Validators.required]],
      isDeleted: [false],
      isSystem: [false]
    });
  }

  ngOnInit(): void {
    if (this.data?.state) {
      this.isEditMode = true;
      this.stateForm.patchValue({
        id: this.data.state.id,
        dateCreated: this.data.state.dateCreated,
        rowVersion: this.data.state.rowVersion,
        name: this.data.state.name,
        hexColor: this.data.state.hexColor,
        isDeleted: this.data.state.isDeleted,
        isSystem: this.data.state.isSystem
      });
    } else {
      this.stateForm.patchValue({
        dateCreated: new Date().toISOString(),
        hexColor: '#000000'
      });
    }
  }

  onColorPickerChange(event: any): void {
    const colorValue = event.target.value;
    this.stateForm.patchValue({ hexColor: colorValue });
  }

  onSubmit(): void {
    if (this.stateForm.valid) {
      if (this.isEditMode) {
        this.updateState();
      } else {
        this.createState();
      }
    } else {
      this.stateForm.markAllAsTouched();
    }
  }

  createState(): void {
    this.loading = true;
    const { id, ...stateDataWithoutId } = this.stateForm.value;
    
    this.stateService.createState(stateDataWithoutId as any).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Estado creado exitosamente');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  updateState(): void {
    this.loading = true;
    const stateData: StateRequest = this.stateForm.value;
    
    this.stateService.updateState(stateData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Estado actualizado exitosamente');
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
    return this.stateForm.get('name');
  }

  get hexColor() {
    return this.stateForm.get('hexColor');
  }
}

