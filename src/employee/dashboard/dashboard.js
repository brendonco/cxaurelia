import 'bootstrap';
import AuthService from '../../login/AuthService';

@inject(AuthService)
export class Dashboard {
  constructor(AuthService) {
    this.auth = AuthService;
  }
}
