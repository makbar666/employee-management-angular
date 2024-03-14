import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/local-storage.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [DatePipe, HttpClient]
})
export class ListComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  constructor(private localStorageService: LocalStorageService, private fb: FormBuilder, private toastr: ToastrService, private datePipe: DatePipe, private http: HttpClient) { }

  searchTerm: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  editData: any;
  selectedEmployeeForEdit: any = null;
  editMode = false;
  maxDate = new Date();

  private readonly key = 'employees';

  selectedEmployee: any;

  ngOnInit(): void {
    this.getEmployeesFromLocalStorage();
    this.filteredEmployees = this.employees.slice();

    const existingData = this.localStorageService.getItem('employees');
    if (!existingData) {
      this.http.get('/assets/dummy.json').subscribe((data: any) => {
        this.localStorageService.setItem('employees', JSON.stringify(data));
        this.getEmployeesFromLocalStorage();

      });
    }
  }

  getEmployeesFromLocalStorage() {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      this.employees = JSON.parse(storedEmployees);
    }
  }

  searchEmployees() {
    this.filteredEmployees = this.employees.filter(employee => {
      const searchText = this.searchTerm.toLowerCase();
      return (employee.username.toLowerCase().includes(searchText) ||
        employee.firstName.toLowerCase().includes(searchText) ||
        employee.lastName.toLowerCase().includes(searchText) ||
        employee.email.toLowerCase().includes(searchText) ||
        employee.basicSalary?.toString().includes(searchText) || // Check for basicSalary as number or string
        employee.status?.toLowerCase().includes(searchText) ||
        employee.group?.toLowerCase().includes(searchText) ||
        employee.description?.toLowerCase().includes(searchText));
    });
  }

  addEmployee!: boolean;

  editProduct(product: any) {
    this.userForm.patchValue({
      username: product.username,
      firstName: product.firstName,
      lastName: product.lastName,
      email: product.email,
      birthDate: product.birthDate,
      basicSalary: product.basicSalary,
      status: product.status,
      group: product.group,
      description: product.description
    });

    this.editMode = true;
    this.selectedEmployeeForEdit = product;
    this.showAddEmployeeSidebar = true;

  }

  viewProduct(product: any) {
    this.showInfoDialog = true;
    this.editData = product;

    console.log(this.editData);
  }

  deleteProduct = (product: any) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.employees.indexOf(product);
        this.employees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(this.employees));
        this.getEmployeesFromLocalStorage();
        this.toastr.success('Employee deleted successfully');
      }
    })
  }

  showAddEmployeeSidebar = false;

  showInfoDialog = false;

  userForm = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
    basicSalary: ['', Validators.required],
    status: ['', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required]
  });

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  groupOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Finance', value: 'Finance' },
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Operations', value: 'Operations' },
    { label: 'Support', value: 'Support' },
    { label: 'Office Boy', value: 'Office Boy' },
    { label: 'Others', value: 'Others' },

  ]

  saveEmployee = () => {
    if (!this.userForm.invalid) {
      const formattedBirthDate = this.datePipe.transform(this.userForm.value.birthDate, 'dd/MM/yyyy');

      Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Untuk menyimpan data ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          const employee = {
            username: this.userForm.value.username,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            email: this.userForm.value.email,
            birthDate: formattedBirthDate,
            basicSalary: this.userForm.value.basicSalary,
            status: this.userForm.value.status,
            group: this.userForm.value.group,
            description: this.userForm.value.description
          };

          const existingData: any[] = JSON.parse(this.localStorageService.getItem('employees') || '[]');

          if (this.editMode && this.selectedEmployeeForEdit) {
            const index = existingData.findIndex(e => e.username === this.selectedEmployeeForEdit.username);
            if (index !== -1) {
              existingData[index] = employee;
            }
          } else {
            existingData.push(employee);
          }

          this.localStorageService.setItem('employees', JSON.stringify(existingData));

          this.userForm.reset();

          this.toastr.success('Employee saved successfully');

          this.showAddEmployeeSidebar = false;

          this.close.emit();

          this.getEmployeesFromLocalStorage();
        }
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  openAddEmployeeSidebar() {
    this.showAddEmployeeSidebar = true;
    this.selectedEmployeeForEdit = null;
  }

  closeAddEmployeeSidebar() {
    this.showAddEmployeeSidebar = false;
    this.getEmployeesFromLocalStorage();
  }

  filterEmployees(value: string, field: string, employee: any) {
    const filterValue = value.toLowerCase();
    return employee[field].toString().toLowerCase().includes(filterValue);
  }


}
