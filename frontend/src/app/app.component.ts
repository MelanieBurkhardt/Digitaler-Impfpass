import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {ApiToken} from "./ApiToken";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loginForm;

  title = 'app';

  apiToken: string;

  showUnauthorizedMessage: boolean;

  apiResult;

  logoutSuccess: boolean;

  user: User;

  constructor(private httpClient: HttpClient) {
    this.user = new User();
  }

  ngOnInit(): void {
  }

  sendForm(): void {
    console.log(this.user.password, this.user.username);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    this.httpClient.post('http://localhost:4006/login',
      'username=' + this.user.username + '&password=' + this.user.password, httpOptions)
      .subscribe(
        r => this.handleTokenSuccess(r as ApiToken),
        error => this.handleTokenError(error));
  }

  handleTokenSuccess(apiToken: ApiToken) {
    this.apiToken = apiToken.token;
    localStorage.setItem('apiToken', apiToken.token);
    this.callApi();
  }

  handleTokenError(error: HttpErrorResponse) {

    if (error.status === 401) {
      this.showUnauthorizedMessage = true;
      setTimeout(() => window.location.replace('http://localhost:8080/saml/login'), 4000);
    }
  }

  callApi() {
    const apiToken = localStorage.getItem("apiToken");
    console.log(apiToken);
    this.httpClient.get('/service/api/mycontroller/', {
      headers: {
        'x-auth-token': apiToken
      }
    }).subscribe(r => this.apiResult = JSON.stringify(r));
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('apiToken');
    this.httpClient.get('service/saml/logout').subscribe(() => this.logoutSuccess = true);
  }


}

class User {
  private _username: string;
  private _password: string;
  constructor(username?: string, password?: string) {
    this._username = username;
    this._password = password;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }
}
