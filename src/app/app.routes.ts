import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Forgotpassword } from './pages/forgotpassword/forgotpassword';
import { ConfirmationCode } from './pages/confirmation-code/confirmation-code';
import { ResetPassword } from './pages/reset-password/reset-password';
import { OrderSearch } from './pages/order-search/order-search';
import { OrderDetails } from './pages/order-details/order-details';
import { ActiveSignals } from './pages/active-signals/active-signals';
import { AlertConfigurator } from './pages/alert-configurator/alert-configurator';
import { AlertCreation } from './component/alert-creation/alert-creation';
import { AlertModification } from './component/alert-modification/alert-modification';

import { authGuard } from './guards/auth.guard';
import { resetPasswordGuard } from './guards/reset-password.guard';

export const routes: Routes = [
    {
        title: 'Order Search',
        path: 'order-search',
        component: OrderSearch,
        canActivate: [authGuard]
    },
    {
        title: 'Order Details',
        path: 'order-details/:id',
        component: OrderDetails,
        canActivate: [authGuard]
    },
    {
        title: 'Login',
        path: '',
        component: Login,
        pathMatch: 'full'
    },
    {
        title: 'Forgot Password',
        path: 'forgot-password',
        component: Forgotpassword
    },
    {
        title: 'Confirmation Code',
        path: 'confirmation-code',
        component: ConfirmationCode,
        canActivate: [resetPasswordGuard]
    },
    {
        title: 'Reset Password',
        path: 'reset-password',
        component: ResetPassword,
        canActivate: [resetPasswordGuard]
    },
    {
        title: 'Active Signals',
        path: 'active-signals',
        component: ActiveSignals,
        canActivate: [authGuard]
    },
    {
        title: 'Alert Configurator',
        path: 'alert-configurator',
        component: AlertConfigurator,
        canActivate: [authGuard]
    },
    {
        title: 'Create Alert',
        path: 'alert-creation',
        component: AlertCreation,
        canActivate: [authGuard]
    },
    {
        title: 'Modify Alert',
        path: 'alert-modification/:id',
        component: AlertModification,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
