import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FrequentQuestion } from '../../interfaces/frequent-question.interface';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { FrequentQuestionFormModalComponent } from '../../shared/components/frequent-question-form-modal/frequent-question-form-modal.component';
import { NotificationService } from '../../services/notification.service';
import { FrequentQuestionService } from '../../services/frequent-question.service';

@Component({
  selector: 'app-frequent-question',
  templateUrl: './frequent-question.component.html',
  styleUrls: ['./frequent-question.component.scss']
})
export class FrequentQuestionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  frequentQuestions: FrequentQuestion[] = [];
  paginatedFrequentQuestions: FrequentQuestion[] = [];
  sortedFrequentQuestions: FrequentQuestion[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private frequentQuestionService: FrequentQuestionService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFrequentQuestions();
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

  loadFrequentQuestions(): void {
    this.loading = true;
    this.frequentQuestionService.getFrequentQuestions().subscribe({
      next: (frequentQuestions) => {
        this.frequentQuestions = frequentQuestions;
        this.sortedFrequentQuestions = [...frequentQuestions];
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
      this.sortedFrequentQuestions = [...this.frequentQuestions];
    } else {
      const data = [...this.frequentQuestions];
      const isAsc = this.sort.direction === 'asc';
      
      this.sortedFrequentQuestions = data.sort((a, b) => {
        switch (this.sort.active) {
          case 'question':
            return this.compare(a.question, b.question, isAsc);
          case 'response':
            return this.compare(a.response, b.response, isAsc);
          default:
            return 0;
        }
      });
    }
    this.updatePaginatedFrequentQuestions();
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  updatePaginatedFrequentQuestions(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFrequentQuestions = this.sortedFrequentQuestions.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedFrequentQuestions();
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(FrequentQuestionFormModalComponent, {
      width: '650px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadFrequentQuestions();
      }
    });
  }

  openEditForm(frequentQuestion: FrequentQuestion): void {
    const dialogRef = this.dialog.open(FrequentQuestionFormModalComponent, {
      width: '650px',
      data: { frequentQuestion: frequentQuestion }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFrequentQuestions();
      }
    });
  }

  deleteFrequentQuestion(id: string): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar esta pregunta frecuente? Esta acción no se puede deshacer.',
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
        this.frequentQuestionService.deleteFrequentQuestion(id).subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Pregunta frecuente eliminada exitosamente');
            this.loadFrequentQuestions();
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

