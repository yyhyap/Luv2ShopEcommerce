import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // inject the ROUTER
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string)
  {
    console.log(`value: ${value}`);
    // route to ROUTE {path: 'search/:keyword', component: ProductListComponent} in app.module.ts
    this.router.navigateByUrl(`/search/${value}`);
  }

}
