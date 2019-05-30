import { Moment } from 'moment';

export interface IPurchase {
    purchaseAmount: number,
    purchaseDateString: string,
    purchaseRewardPoints: number
}

export interface ICustomer {
    customerID: number,
    purchases: IPurchase[]
}
