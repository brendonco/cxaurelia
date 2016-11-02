import AuthService from '../../login/AuthService';
import { inject } from 'aurelia-framework';

@inject(AuthService)
export class Dashboard {
  constructor(AuthService) {
    this.auth = AuthService;
  }
}
