import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Forgotpassword } from './forgotpassword/forgotpassword';

export const routes: Routes = [
    {
        title: 'Login',
        path: '',
        component: Login
    },
    {
        title: 'Forgot Password',
        path: 'forgot-password',
        component: Forgotpassword
    }
];
