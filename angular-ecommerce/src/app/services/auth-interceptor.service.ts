import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { url } from 'inspector';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private oktaAuth: OktaAuthService) { }

  // HttpRequest >>> the outgoing request object to handle
  // HttpHandler >>> the next interceptor in the chain, or the backend if no interceptors in the chain
  // Observable<HttpEvent<any>> >>> an observable of the event stream
  // from >>> Converts its argument to an Observable instance.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }


  // Promise >>> a placeholder for future value
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // Only add access token for secured endpoints
    const theEndpoint = environment.luv2shopApiUrl + '/orders';
    const securedEndPoints = [theEndpoint];

    // urlWithParams >>> the outgoing URL with all paremeters set
    if(securedEndPoints.some(url => request.urlWithParams.includes(url))){
      
      // get access token
      // getAccessToken() >>> Async call
      // await >>> wait for the async call to finish
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token
      // clone the request because the request is IMMUTABLE
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    // continue to next intercepter in the chain, or make the call to the REST API if there is no other interceptor
    return next.handle(request).toPromise();
  }

}
