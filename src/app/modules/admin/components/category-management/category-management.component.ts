import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EMPTY, switchMap } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/http/category.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { CategoryManagementFormComponent } from '../category-management-form/category-management-form.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  public categories: Category[] = [];
  public page: number = 0;
  public size: number = 10;
  public totalItems: number = 0;
  public displayedColumns: string[] = ['name', 'createdBy', 'createdDate', 'modifiedBy', 'modifiedDate', 'actions'];
  public pageEvent: PageEvent;
  public pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  public handlePageEvent(pageEvent: PageEvent){
    this.pageEvent = pageEvent;
    this.totalItems = pageEvent.length;
    this.page = pageEvent.pageIndex;
    this.size = pageEvent.pageSize;
    this.getCategories();
  }

  public getCategories(){
    this.categoryService.getCategoriesPageable(this.page, this.size).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.totalItems = response.totalItems;
      },
      error: (error) => {
        this.toastService.showError(error.message);
      }
    });
  }

  public showForm(isAdd: boolean, isEdit: boolean, isDelete: boolean, category?: Category){
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: category,
        isAdd: isAdd,
        isEdit: isEdit,
        isDelete: isDelete
      }
    };

    const dialogRef = this.dialog.open(CategoryManagementFormComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      switchMap(
        (response)=>{
          if(response){
            if (isAdd) return this.categoryService.postCategory(response);
            else if (isEdit) return this.categoryService.putCategory(response, category.id);
            else return this.categoryService.deletCategory(category.id);
          }else{
            return EMPTY;
          }
        }
      )
    )
    .subscribe({
      next: (response) => {
        //for delete
        if(typeof response === 'boolean') this.toastService.showSuccess('Category ' + category.name +' has been deleted!');
        else{
          if(isAdd) this.toastService.showSuccess('New category ' + response.name + ' has been added!');
          else this.toastService.showSuccess('Category ' + category.name +' has been updated!');
        }
        this.getCategories();
      },
      error: (error) => {
        if(isAdd) this.toastService.showError('Unable to add new category:' + error.message + ', ' + error.error.message);
        if(isEdit) this.toastService.showError('Unable to edit category:' + error.message + ', ' + error.error.message);
        if(isDelete) this.toastService.showError('Unable to delete category:' + error.message + ', ' + error.error.message);
      } 
    });
  }
}
