import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

// can be injected to other components / classes
@Injectable({
  // means can be injected globally
  providedIn: 'root'
})
export class ProductService {

  // By default, Spring Data REST only returns the first page of 20 items. Can modify by adding ?size=100 (100 items per page).
  private baseUrl: string = environment.luv2shopApiUrl + '/products';

  private productCategoryUrl: string = environment.luv2shopApiUrl + '/product-category';

  // inject HttpClient
  constructor(private httpClient: HttpClient) { }


  // Observable<Product[]> returns an observable
  // map JSON data from Spring Data REST to Product Array
  getProductList(theCategoryId: number): Observable<Product[]>
  {

    // need to build URL based on category id
    const categoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(categoryUrl);
  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts>
  {

    // need to build URL based on category id, page and size
    const categoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(categoryUrl);
  }

  getAllProductList(): Observable<Product[]>
  {
    const baseUrlSize100 = `${this.baseUrl}?size=100`;

    return this.getProducts(baseUrlSize100);
  }

  getAllProductListPaginate(thePage: number, thePageSize: number): Observable<GetResponseProducts>
  {
    // const baseUrlSize100 = `${this.baseUrl}?size=100`;
    const baseUrl = `${this.baseUrl}?page=${thePage}&size=${thePageSize}`;

    console.log(`Getting products from --- ${baseUrl}`);

    return this.httpClient.get<GetResponseProducts>(baseUrl);
  }
  

  /*
      "_embedded": {
        "products": [
          {
            "sku": "BOOK-TECH-1000",
            "name": "JavaScript - The Fun Parts",
            "description": "Learn JavaScript",
            "unitPrice": 19.99,
            "imageUrl": "assets/images/products/placeholder.png",
            "active": true,
            "unitsInStock": 100,
            "dateCreated": "2021-01-23T16:36:40.000+00:00",
            "lastUpdated": null,
            "_links": {
              "self": {
                "href": "http://localhost:8080/api/products/1"
              },
              "product": {
                "href": "http://localhost:8080/api/products/1"
              },
              "category": {
                "href": "http://localhost:8080/api/products/1/category"
              }
            }
    */
   
  getProductCategories(): Observable<ProductCategory[]>
  {
    return this.httpClient.get<GetResponseProductCategory>(this.productCategoryUrl).pipe
    (
      // return as Observable
      // Map JSON data from Spring Data Rest to ProductCategory array
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]>
  {
    // need to build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts>
  {
    // need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(Url: string): Observable<Product[]> 
  {
    return this.httpClient.get<GetResponseProducts>(Url).pipe
    (
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product>
  {
    // need to build URL based on product ID
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

}

// Unwrap the JSON from Spring Data REST _embedded entry
interface GetResponseProducts
{
  _embedded:
  {
    products: Product[];
  },
  page:
  {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

// Unwrap the JSON from Spring Data REST _embedded entry
interface GetResponseProductCategory
{
  _embedded:
  {
    productCategory: ProductCategory[];
  }
}

