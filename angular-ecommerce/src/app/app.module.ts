import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Router, Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

const oktaConfig = Object.assign
({
  // create new object: onAuthRequired
  // when users try to login application and havent been authenticated
  // then will route them to login page
  onAuthRequired: (oktaAuth: any, injector: any) =>
  {
    const router = injector.get(Router);

    // Redirect user to custom login page
    router.navigate(['/login']);
  }
  // pass in OpenID Connect JSON config
}, myAppConfig.oidc);

// define routes
// order of routes is important, first match wins
// start from most specfic to generic
const routes: Routes = [
  // OktaAuthGuard >>> Route Guard, if authenticated, give access to route, else send to login page
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard]},
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard]},  

  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  // when the path matches, ProductListComponent will be CREATED
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  // when insert nothing to the path, redirect to /products
  // pathMatch: 'full' >>> match the full path (instead of prefix)
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  // generic wildcard >>> will match on anything that didnt match above routes
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule
    HttpClientModule,
    // configure ROUTER based on given routes
    RouterModule.forRoot(routes),
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  
  // ALLOW us to INJECT the given service to other parts of application  
  providers: [
    // inject ProductService
    ProductService,
    // { provide: OKTA_CONFIG, useValue: oktaConfig } >>> dependency injection for Okta Auth Service 
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    // provide: HTTP_INTERCEPTORS >>> Token for HTTP Interceptor
    // useClass: AuthInterceptorService >>> Register AuthInterceptorService as an Interceptor
    // multi: true >>> can have zero to many interceptors, inform Angular that HTTP_INTERCEPTORS is a token for injection an array of values
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
