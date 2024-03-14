import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService) { }

  loginForm!: FormGroup;
  username!: string
  password!: string
  loading: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginClick() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in the required fields', 'Error');
    } else {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/list']);
      }, 2000);
    }
  }
}