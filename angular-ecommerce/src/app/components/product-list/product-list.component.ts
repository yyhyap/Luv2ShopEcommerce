import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number | undefined;

  previousCategoryId: number = 1;

  currentCategoryName: string | undefined;

  searchMode: boolean | undefined;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  // inject ActivatedRoute
  // ActivatedRoute >>> current active route that loaded the component
  // Useful for accessing route parameters
  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  // similar to @PostConstruct in Java
  ngOnInit(): void {
    this.route.paramMap.subscribe
    (
      () => 
      {
       this.listProducts();
      }
    );
  }

  listProducts(): void
  {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    
    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else
    {
      this.handleListProducts();
    }
  }
  
  handleListProducts(): void
  {
    // check if "id" parameter is available
    // this.route >>> use activated route
    // snapshot >>> state of route at this given moment in time
    // paramMap >>> Map all of the route parameters
    // "id" >>> read the "id" parameter
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if(hasCategoryId)
    {
      // get the "id" parameter string, CONVERT STRING to a NUMBER using "+" symbol
      // parameter value is returned as a STRING
      // ! >>> assert that +this.route.snapshot.paramMap.get("id") is NOT NULL
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;

      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
      

      // Check if we have a different category id than previous
      // NOTE: Angular will reuse the component if it is currently being viewed

      // if we have a different category id than previous
      // then set thePageNumber back to 1
      if(this.previousCategoryId != this.currentCategoryId)
      {
        this.thePageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;

      console.log(`currentCategoryId: ${this.currentCategoryId}, thePageNumber: ${this.thePageNumber}`);

      // Method is invoked when "SUBSCRIBED"
      // get the product for the given category id
      // PAGINATION component: pages are 1 based
      // Spring Data REST: pages are 0 based
      this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize,this.currentCategoryId).subscribe
      (
        data =>
        {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      );

    }
    else
    {



      // Method is invoked when "SUBSCRIBED"
      // get the product for the given category id
      this.productService.getAllProductListPaginate(this.thePageNumber - 1, this.thePageSize).subscribe
      (
        data => 
        {
          // assign results to Product Array
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      );
    }

    /*
    // Method is invoked when "SUBSCRIBED"
    // get the product for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe
    (
      data => 
      {
        // assign results to Product Array
        this.products = data;
      }
    )
    */

  }

  handleSearchProducts(): void 
  {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if(this.previousKeyword != theKeyword)
    {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword: ${theKeyword}, thePageNumber: ${this.thePageNumber}`);

    // search for products using that 'KEYWORD'
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe
    (
      data =>
      {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  /*
  processResult()
  {
    return data =>
      {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }    
  }
  */

  updatePageSize(pageSize: number)
  {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product)
  {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // TODO: do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
