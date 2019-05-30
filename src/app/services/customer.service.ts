import { Injectable } from '@angular/core';
import { IPurchase, ICustomer } from '../interfaces/purchase.type';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  purchaseHistory: IPurchase[] = [];
  customerList: ICustomer[] = [];
}
