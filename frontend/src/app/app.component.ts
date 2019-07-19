import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {ApiToken} from "./ApiToken";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Digitaler Impfpass';

  apiToken: string;

  samlAuthorizationUrl = 'http://localhost:4006/login';

  showUnauthorizedMessage: boolean;

  apiResult;

  logoutSuccess: boolean;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {

    this.httpClient.get('http://localhost:4006/apitoken')
      .subscribe(
        r => this.handleTokenSuccess(r as ApiToken),
        error => this.handleTokenError(error));

  }

  handleTokenSuccess(apiToken: ApiToken) {
    this.apiToken = apiToken.token;
    localStorage.setItem("apiToken", apiToken.token);
    this.callApi();
  }

  handleTokenError(error: HttpErrorResponse) {

    if (error.status === 401) {
      this.showUnauthorizedMessage = true;
      setTimeout(() => window.location.replace(this.samlAuthorizationUrl), 4000);
    }
  }

  callApi() {
    const apiToken = localStorage.getItem("apiToken");

    this.httpClient.get('/service/api/mycontroller/', {
      headers: {
        "x-auth-token": apiToken
      }
    }).subscribe(r => this.apiResult = JSON.stringify(r));
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('apiToken');
    this.httpClient.get('http://localhost:4006/logout').subscribe(() => this.logoutSuccess = true);
  }


}
