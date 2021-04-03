import { createDirectiveType } from '@angular/compiler/src/render3/view/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup | undefined;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  // 2 state arrays because getStates(theCountryCode: string) in form.service ONLY ACCEPT 1 country code at 1 TIME
  // in case 2 different countries are SELECTED, generate 2 different state arrays for RESPECTIVE COUNTRY
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, 
    private luv2ShopFormService: Luv2ShopFormService, 
    private cartService: CartService, 
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group
    ({
      customer: this.formBuilder.group
      ({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        /*
        ^[a-z0-9._%+-]+  >>> match any combination of letters and digits, optional period
        @ >>> @ symbol
        [a-z0-9.-]+\\. >>> match any combination of letters and digits, with period
        [a-z]{2,4}$ >>> domain extension, 2-4 letters 
        */
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group
      ({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group
      ({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group
      ({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', Validators.required),
        expirationYear: new FormControl('', Validators.required)
      })
    });

    // populate credit card months
    // getMonth() >>> get current month
    // javascript date for getMonth() is 0-based
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe
    (      
      data => 
      {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe
    (
      data =>
      {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe
    (
      data =>
      {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

  }

  // getter methods will be used HTML template to get access to the form control
  get firstName()
  {
    return this.checkoutFormGroup!.get('customer.firstName')!;
  }

  get lastName()
  {
    return this.checkoutFormGroup!.get('customer.lastName')!;
  }

  get email()
  {
    return this.checkoutFormGroup!.get('customer.email')!;
  }

  // shipping address

  get shippingAddressStreet()
  {
    return this.checkoutFormGroup!.get('shippingAddress.street')!;
  }

  get shippingAddressCity()
  {
    return this.checkoutFormGroup!.get('shippingAddress.city')!;
  }

  get shippingAddressState()
  {
    return this.checkoutFormGroup!.get('shippingAddress.state')!;
  }

  get shippingAddressCountry()
  {
    return this.checkoutFormGroup!.get('shippingAddress.country')!;
  }

  get shippingAddressZipCode()
  {
    return this.checkoutFormGroup!.get('shippingAddress.zipCode')!;
  }

  // billing address

  get billingAddressStreet()
  {
    return this.checkoutFormGroup!.get('billingAddress.street')!;
  }

  get billingAddressCity()
  {
    return this.checkoutFormGroup!.get('billingAddress.city')!;
  }

  get billingAddressState()
  {
    return this.checkoutFormGroup!.get('billingAddress.state')!;
  }

  get billingAddressCountry()
  {
    return this.checkoutFormGroup!.get('billingAddress.country')!;
  }

  get billingAddressZipCode()
  {
    return this.checkoutFormGroup!.get('billingAddress.zipCode')!;
  }

  // credit card

  get cardType() 
  { 
    return this.checkoutFormGroup!.get("creditCard.cardType")!; 
  }

  get nameOnCard() 
  { 
    return this.checkoutFormGroup!.get("creditCard.nameOnCard")!; 
  }

  get cardNumber() 
  { 
    return this.checkoutFormGroup!.get("creditCard.cardNumber")!; 
  }

  get securityCode() 
  { 
    return this.checkoutFormGroup!.get("creditCard.securityCode")!; 
  }

  get expirationMonth() 
  { 
    return this.checkoutFormGroup!.get("creditCard.expirationMonth")!; 
  }
  
  get expirationYear() 
  { 
    return this.checkoutFormGroup!.get("creditCard.expirationYear")!; 
  }

  onSubmit()
  {
    console.log("Handling the submit button ...");

    // add event handler to CHECK validation status
    if(this.checkoutFormGroup!.invalid)
    {
      // touching all fields triggers the display of the error messages
      this.checkoutFormGroup!.markAllAsTouched();
      // if invalid, do not execute everything
      return;
    }

    // set up order
    let order = new Order(this.totalQuantity, this.totalPrice);

    // get cart items
    const cartItems: CartItem[] = this.cartService.cartItems;

    // create orderItems from cartItems

    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++)
    {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // populate purchase - customer
    let customer: Customer = this.checkoutFormGroup!.controls['customer'].value!;

    // populate purchase - shipping address
    let shippingAddress: Address = this.checkoutFormGroup!.controls['shippingAddress'].value!;

    // JSON.parse(JSON.stringify( )) is for cloning the object
    // State and Country are array objects, we need to get the selected value to pass it to Purchase DTO
    // state and country are declared as string in Address class
    const shippingState: State = JSON.parse(JSON.stringify(shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(shippingAddress.country));
    shippingAddress.state = shippingState.name;
    shippingAddress.country = shippingCountry.name;


    // populate purchase - billing address
    let billingAddress: Address = this.checkoutFormGroup!.controls['billingAddress'].value!;

    // JSON.parse(JSON.stringify( )) is for cloning the object
    // State and Country are array objects, we need to get the selected value to pass it to Purchase DTO
    // state and country are declared as string in Address class
    const billingState: State = JSON.parse(JSON.stringify(billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(billingAddress.country));
    billingAddress.state = billingState.name;
    billingAddress.country = billingCountry.name;

    // populate purchase - order and order items
    // set up purchase
    let purchase = new Purchase(customer, shippingAddress, billingAddress, order, orderItems);
    console.log(JSON.stringify(purchase));

    // call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe
    ({
        // next: success/happy path
        next: response =>
        {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        // error: error handling
        error: err =>
        {
          alert(`There was an error: ${err.message}`);
        }
    });

  }

  resetCart()
  {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);

    // reset the form
    this.checkoutFormGroup!.reset();

    // navigate back to main product pageSize
    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress(event: any)
  {
    if(event.target.checked)
    {
      // populate state for billing address states
      // since getStates(formGroupName: string) is NOT called when checkbox is checked
      this.billingAddressStates = this.shippingAddressStates;

      this.checkoutFormGroup!.controls.billingAddress.setValue(this.checkoutFormGroup!.controls.shippingAddress.value);
    }
    else
    {
      this.billingAddressStates = [];

      this.checkoutFormGroup!.controls.billingAddress.reset();
    }
  }

  handleMonthsAndYears()
  {
    const creditCardFormGroup = this.checkoutFormGroup!.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year EQUALS TO selected year, then start with current month
    let startMonth: number;
    
    if(currentYear === selectedYear)
    {
      startMonth = new Date().getMonth() + 1;
    }
    else
    {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe
    (      
      data => 
      {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string)
  {
    const formGroup = this.checkoutFormGroup!.get(formGroupName)!;

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe
    (
      data =>
      {
        // 2 state arrays because getStates(theCountryCode: string) in form.service ONLY ACCEPT 1 country code at 1 TIME
        // in case 2 different countries are SELECTED, generate 2 different state arrays for RESPECTIVE COUNTRY
        if(formGroupName === 'shippingAddress')
        {
          this.shippingAddressStates = data;
        }
        else
        {
          if(formGroupName === 'billingAddress')
          {
            this.billingAddressStates = data;
          }
        }

        // select first item by default
        formGroup.get('state')?.setValue(data[0]);

      }
    );
  }

  reviewCartDetails()
  {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe
    (
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe
    (
      totalPrice => this.totalPrice = totalPrice
    );
  }

}
