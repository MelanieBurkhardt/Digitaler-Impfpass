import { Component, OnInit } from '@angular/core';

export interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-template-country',
  templateUrl: './template-country.component.html',
  styleUrls: ['./template-country.component.sass']
})
export class TemplateCountryComponent implements OnInit {

  countries: Country[] = [
    {value: 'ind', viewValue: 'Indien'},
    {value: 'gca', viewValue: 'Guatemala'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
