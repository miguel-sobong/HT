import { UserService } from './../core/services/user/user.service';
import { AuthService } from './../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private userService: UserService, private formbuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.registerForm = this.formbuilder.group({
      email: ['', [Validators.email, Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
      mobileNumber: ['', [Validators.required]],
    }, { validators: this.passwordMatch });
  }

  passwordMatch(form: FormGroup) {
    const password1 = form.get('password');
    const password2 = form.get('password2');
    return password1 && password2 && (password1.value !== password2.value) ? { passwordMatch: false } : null;
  }

  register() {
    this.userService.createUser(this.registerForm.value);
  }
}
