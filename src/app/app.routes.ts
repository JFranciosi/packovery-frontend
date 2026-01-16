import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { ConfirmationCode } from './confirmation-code/confirmation-code';
import { ResetPassword } from './reset-password/reset-password';

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
    },
    {
        title: 'Confirmation Code',
        path: 'confirmation-code',
        component: ConfirmationCode
    },
    {
        title: 'Reset Password',
        path: 'reset-password',
        component: ResetPassword
    }
];
