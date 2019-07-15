import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-header',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.sass']
})
export class TemplateHeaderComponent implements OnInit {
  public title: string;
  public krankenkasse: string;

  constructor() {
    this.title =  "Impfungen";
    this.krankenkasse =  "AOK";
  }

  ngOnInit() {
  }

}
