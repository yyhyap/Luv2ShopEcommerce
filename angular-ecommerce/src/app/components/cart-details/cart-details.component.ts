import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails()
  {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    /* 
    Subject: On subscribing it always GETS the data which is PUSHED AFTER it's SUBCRIPTION
    i.e. PREVIOUS pushed values are NOT received.
    */

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe
    (
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe
    (
      data => this.totalQuantity = data
    );

    // compute cart total price and quantity
    // this will TRIGGER NEW EVENTS from the cart service to PUBLISH new values
    // so that totalPrice and totalQuantiy can SUBCRIBE to the new PUBLISHED  values
    this.cartService.computeCartTotals();
    
  }

  incrementQuantity(theCartItem: CartItem)
  {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem)
  {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem)
  {
    this.cartService.remove(theCartItem);
  }

}
