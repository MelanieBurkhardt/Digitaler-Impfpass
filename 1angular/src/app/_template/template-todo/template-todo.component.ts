import { Component, OnInit } from '@angular/core';

export interface Country {
  value: string;
  viewValue: string;
}

export interface Impfung {
  countrycode: string;
  viewValue: string;
}

@Component({
  selector: 'app-template-todo',
  templateUrl: './template-todo.component.html',
  styleUrls: ['./template-todo.component.sass']
})
export class TemplateTodoComponent implements OnInit {
  public nutzername: string;
  public impfungen_for_sel_country: string[];
  sel_country: string;

  countries: Country[] = [
    {value: 'ind', viewValue: 'Indien'},
    {value: 'gca', viewValue: 'Guatemala'}
  ];

  impfungen: Impfung[] = [
    {countrycode: 'gca', viewValue: 'Gelbfieber'},
    {countrycode: 'gca', viewValue: 'Hepatitis A'},
    {countrycode: 'ind', viewValue: 'Hepatitis A'},
    {countrycode: 'gca', viewValue: 'Polio'},
    {countrycode: 'ind', viewValue: 'Polio'},
    {countrycode: 'gca', viewValue: 'Hepatitis B'},
    {countrycode: 'ind', viewValue: 'Hepatitis B'},
    {countrycode: 'gca', viewValue: 'Typhus'},
    {countrycode: 'ind', viewValue: 'Typhus'},
    {countrycode: 'gca', viewValue: 'Tollwut'},
    {countrycode: 'ind', viewValue: 'Tollwut'},
    {countrycode: 'ind', viewValue: 'Meningokokken'},
    {countrycode: 'ind', viewValue: 'Enzephalitis'},
  ];

  constructor() { 
    console.log("TEST 1");
    this.nutzername = "Ana Tomic"
  }

  ngOnInit() {
  }

  onCountrySelection() {
    console.log("TEST 2");
    let counter: number = 0;
    this.impfungen_for_sel_country = [];

    for(let i = 0; i < this.impfungen.length; i++){
      if(this.impfungen[i].countrycode == this.sel_country) {
        this.impfungen_for_sel_country[counter] = this.impfungen[i].viewValue;
        counter++;
      }
    }

    console.log(this.impfungen_for_sel_country);
  }

}
