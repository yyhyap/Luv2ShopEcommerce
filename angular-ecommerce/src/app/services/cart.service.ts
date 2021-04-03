import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable
  // set 0 as initial value for BehaviorSubject
  // will re-emit ONLY the LAST emitted value, or a DEFAULT VALUE if NO value has been previously emitted
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // reference to web browser's session storage
  storage: Storage = sessionStorage;  

  // data is persisted and survived browser restarts
  // stores data locally at client web browser computer
  //storage: Storage = localStorage;  

  constructor() 
  { 
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null)
    {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals(); 
    }
  }

  addToCart(theCartItem: CartItem)
  {
    // check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined; 

    if(this.cartItems.length > 0)
    {
      // find the item in the cart based on item id
      /*
      for(let tempCartItem of this.cartItems)
      {
        if(tempCartItem.id === theCartItem.id)
        {
          existingCartItem = tempCartItem;
          break;
        }
      }
      */
      
      // if test passes, return the first element in the array that passed
      // if test fails for all elements in the array, then returns undefined
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    
    if(alreadyExistsInCart)
    {
      // increment the quantity
      existingCartItem!.quantity = existingCartItem!.quantity + 1;
    }
    else
    {
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity;
    this.computeCartTotals();

  }

  computeCartTotals()
  {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems)
    {
      totalPriceValue = totalPriceValue + (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue = totalQuantityValue + currentCartItem.quantity;
    }

    // publish the new values ... all the subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart item
    this.persistCartItem();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number)
  {
    console.log("Contents of the cart");

    for(let tempCartItem of this.cartItems)
    {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    // toFixed(2) >>> 2 decimals
    console.log(`Total Price: ${totalPriceValue.toFixed(2)}, Total Quantity: ${totalQuantityValue}`);
    console.log("--------");
  }

  decrementQuantity(theCartItem: CartItem)
  {
    theCartItem.quantity = theCartItem.quantity - 1;

    if(theCartItem.quantity === 0)
    {
      this.remove(theCartItem);
    }
    else
    {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem)
  {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if(itemIndex > -1)
    {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

  persistCartItem()
  {
    // cartItems >>> key
    // JSON.stringify(this.cartItems) >>> value
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

}
