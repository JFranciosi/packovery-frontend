import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { ConfirmationCode } from './confirmation-code/confirmation-code';
import { ResetPassword } from './reset-password/reset-password';
import { OrderSearch } from './order-search/order-search';

export const routes: Routes = [
    {
        title: 'Order Search',
        path: 'order-search',
        component: OrderSearch
    },
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
