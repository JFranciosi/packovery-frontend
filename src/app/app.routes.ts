import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { ConfirmationCode } from './confirmation-code/confirmation-code';
import { ResetPassword } from './reset-password/reset-password';
import { OrderSearch } from './order-search/order-search';
import { OrderDetails } from './order-details/order-details';

export const routes: Routes = [
    {
        title: 'Order Search',
        path: 'order-search',
        component: OrderSearch
    },
    {
        title: 'Order Details',
        path: 'order-details', // Just 'order-details' for now to match link, can add '/:id' if we really passed id
        component: OrderDetails
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
