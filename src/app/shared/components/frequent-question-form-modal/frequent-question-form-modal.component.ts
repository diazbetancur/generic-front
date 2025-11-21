import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FrequentQuestion, FrequentQuestionRequest } from '../../../interfaces/frequent-question.interface';
import { FrequentQuestionService } from '../../../services/frequent-question.service';
import { NotificationService } from '../../../services/notification.service';

export interface FrequentQuestionFormModalData {
  frequentQuestion?: FrequentQuestion;
}

@Component({
  selector: 'app-frequent-question-form-modal',
  templateUrl: './frequent-question-form-modal.component.html',
  styleUrls: ['./frequent-question-form-modal.component.scss']
})
export class FrequentQuestionFormModalComponent implements OnInit {
  frequentQuestionForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<FrequentQuestionFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FrequentQuestionFormModalData,
    private fb: FormBuilder,
    private frequentQuestionService: FrequentQuestionService,
    private notificationService: NotificationService
  ) {
    this.frequentQuestionForm = this.fb.group({
      id: [''],
      dateCreated: [''],
      rowVersion: [''],
      question: ['', [Validators.required]],
      response: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data?.frequentQuestion) {
      this.isEditMode = true;
      this.frequentQuestionForm.patchValue({
        id: this.data.frequentQuestion.id,
        dateCreated: this.data.frequentQuestion.dateCreated,
        rowVersion: this.data.frequentQuestion.rowVersion,
        question: this.data.frequentQuestion.question,
        response: this.data.frequentQuestion.response
      });
    } else {
      this.frequentQuestionForm.patchValue({
        dateCreated: new Date().toISOString()
      });
    }
  }

  onSubmit(): void {
    if (this.frequentQuestionForm.valid) {
      if (this.isEditMode) {
        this.updateFrequentQuestion();
      } else {
        this.createFrequentQuestion();
      }
    } else {
      this.frequentQuestionForm.markAllAsTouched();
    }
  }

  createFrequentQuestion(): void {
    this.loading = true;
    const formValue = this.frequentQuestionForm.value;
    const frequentQuestionData: FrequentQuestionRequest = {
      dateCreated: formValue.dateCreated,
      rowVersion: formValue.rowVersion,
      question: formValue.question,
      response: formValue.response
    };
    
    this.frequentQuestionService.createFrequentQuestion(frequentQuestionData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Pregunta frecuente creada exitosamente');
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  updateFrequentQuestion(): void {
    this.loading = true;
    const frequentQuestionData: FrequentQuestionRequest = this.frequentQuestionForm.value;
    
    this.frequentQuestionService.updateFrequentQuestion(frequentQuestionData).subscribe({
      next: () => {
        this.notificationService.success('Éxito', 'Pregunta frecuente actualizada exitosamente');
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

  get question() {
    return this.frequentQuestionForm.get('question');
  }

  get response() {
    return this.frequentQuestionForm.get('response');
  }
}

