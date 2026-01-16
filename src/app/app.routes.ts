import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { ConfirmationCode } from './confirmation-code/confirmation-code';
import { ResetPassword } from './reset-password/reset-password';
import { OrderSearch } from './order-search/order-search';
import { OrderDetails } from './order-details/order-details';
import { ActiveSignals } from './active-signals/active-signals';
import { AlertConfigurator } from './alert-configurator/alert-configurator';
import { AlertCreation } from './alert-creation/alert-creation';
import { AlertModification } from './alert-modification/alert-modification';

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
    },
    {
        title: 'Active Signals',
        path: 'active-signals',
        component: ActiveSignals
    },
    {
        title: 'Alert Configurator',
        path: 'alert-configurator',
        component: AlertConfigurator
    },
    {
        title: 'Create Alert',
        path: 'alert-creation',
        component: AlertCreation
    },
    {
        title: 'Modify Alert',
        path: 'alert-modification/:id',
        component: AlertModification
    }
];
