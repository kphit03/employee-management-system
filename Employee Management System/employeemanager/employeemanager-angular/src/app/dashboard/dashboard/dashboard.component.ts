import { Component, OnInit } from '@angular/core';
import { Employee } from '../../employee';
import { EmployeeService } from '../../employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  public employees!: Employee[];
  public editEmployee: Employee | null = null;
  public deleteEmployee!: Employee | null;
  public errorMessage: string | null = null;
  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees(); //runs our function below when the app starts
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById("add-employee-form")!.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onEditEmployee(employee: Employee): void {

    // User input validation 
    if (!employee.firstName || !employee.lastName || !employee.email || !employee.phone) {
      this.errorMessage = `EDIT FAILED: Name, Email, or Phone Number cannot be null or empty, please fix immediately. For: ${employee.firstName} ${employee.lastName}`;
      return;  // Stop the update if validation fails
    }

    // Optional: Additional validation for email format and phone number
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^[0-9]{10}$/;  // Assuming a simple 10-digit phone format

    if (!emailRegex.test(employee.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!phoneRegex.test(employee.phone)) {
      this.errorMessage = 'Please enter a valid phone number (10 digits).';
      return;
    }

    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {//loop over our employees that we have in our app currently
      if (employee.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.department.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      } 
    }
    this.employees = results;
    if (results.length == 0 || !key) {
      this.getEmployees();
    }
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(employee: Employee | null, mode: string): void{
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode == 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode == 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');
    }
    if (mode == 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container!.appendChild(button);
    button.click();
  }
  
  generateReport() {
    //logic here
  
    const workSheet = XLSX.utils.json_to_sheet(this.employees);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Employee Report");

    XLSX.writeFile(workBook, "EmployeeInformation.xlsx");
    console.log("Generated report");
  }

  public isFormValid(): boolean {
    return !!(this.editEmployee && this.editEmployee.firstName && this.editEmployee.lastName && this.editEmployee.email && this.editEmployee.phone);
  }
  
}
