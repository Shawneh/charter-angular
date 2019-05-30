import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ICustomer } from 'src/app/interfaces/purchase.type';
import * as moment from 'moment';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit {
  @ViewChild('purchaseSort', { static: true }) purchaseSort: MatSort;

  customerList: ICustomer[];
  currentCustomerID: number;

  purchaseTableDisplay = ['purchaseDateString', 'purchaseAmount', 'purchaseRewardPoints']
  purchaseTableData = new MatTableDataSource();
  purchaseCount: number;
  tableTotalPurchases: number;
  tableTotalPoints: number;

  // Variables for the Summary Section
  allCustomers: boolean;

  singleThirtyPurchases: any;
  singleThirtyPoints: number;
  singleSixtyPurchases: any;
  singleSixtyPoints: number;
  singleNinetyPurchases: any;
  singleNinetyPoints: number;

  allThirtyPurchases: any;
  allThirtyPoints: number;
  allSixtyPurchases: any;
  allSixtyPoints: number;
  allNinetyPurchases: any;
  allNinetyPoints: number;
  allTotalPurchases: any;
  allTotalPoints: number;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.purchaseCount = this.customerService.purchaseHistory.length;
    this.customerList = this.customerService.customerList;
    // Sets all of the Summary Variables to 0
    this.clearSummary('single');
    this.allCustomers = false;

    // Begin with one customer
    this.generateCustomerData(90);

    this.purchaseTableData.sort = this.purchaseSort;
  }

  generateCustomerData(numberOfDays) {

    //Empty the previously generated purchase history
    this.customerService.purchaseHistory = [];

    // Find the date that is numberOfDays ago, including today.
    let currentDate = moment().subtract(numberOfDays - 1, 'days');
    let daysSinceLastPurchase = 0;

    for (var i = 0; i < numberOfDays; i++) {

      // Makes the customer purchase on a given day random
      if ( Math.random() <= .4 ) {
        this.customerService.purchaseHistory.push(
          {
            purchaseAmount: this.generatePurchaseAmount(),
            purchaseDateString: currentDate.add(daysSinceLastPurchase, 'days').format('MM-DD-YY'),
            purchaseRewardPoints: 0
          }
        );
        // Purchase was made, reset to 0
        daysSinceLastPurchase = 0
      }
      // The day is over, add one
      daysSinceLastPurchase += 1;
    }

    this.calculateRewardPoints();

    // Store the newly generated data to a new customer
    this.customerService.customerList.push(
      {
        customerID: this.customerService.customerList.length + 1,
        purchases: this.customerService.purchaseHistory
      }
    )

    this.customerList = this.customerService.customerList;
    this.currentCustomerID = this.customerList.length;

    // Calculations for table footer
    this.totalPurchasesAmount();
    this.totalPoints();
    this.purchaseCount = this.customerService.purchaseHistory.length;

    //
    this.singleCustomerSummary();

    // Update the table's data
    this.purchaseTableData.data = this.customerService.purchaseHistory;
  }

  generatePurchaseAmount() {
    // Max purchase amount in $300
    // Precision to two decimal places
    return Math.floor(Math.random() * Math.floor(300) * 100) / 100;
  }

  calculateRewardPoints() {

    let rewardPoints: number;
    let amountFloor: number;

    for (let purchase of this.customerService.purchaseHistory) {
      amountFloor = Math.floor(purchase.purchaseAmount)
      if (amountFloor > 50 && amountFloor <= 100 ) {
        rewardPoints = amountFloor - 50; 
      } else if (amountFloor > 100) {
        rewardPoints = ((amountFloor - 100) * 2) + 50;
      } else {
        rewardPoints = 0;
      }
      purchase.purchaseRewardPoints = rewardPoints;
    }
    this.purchaseTableData.data = this.customerService.purchaseHistory;
  }

  totalPurchasesAmount() {
    let total = 0;
    const customer = this.getCurrentCustomer();
    for (const purchase of customer.purchases) {
      total += purchase.purchaseAmount;
    }
    this.tableTotalPurchases = parseFloat(total.toPrecision(6));
    return;
  }

  totalPoints() {
    let total = 0;
    const customer = this.getCurrentCustomer();
    for (const purchase of customer.purchases) {
      total += purchase.purchaseRewardPoints;
    }
    this.tableTotalPoints = total;
    return;
  }

  getCurrentCustomer(ID?: number) {
    if (arguments.length > 0) this.currentCustomerID = ID;
    for (const customer of this.customerList) {
      if (customer.customerID === this.currentCustomerID) {
        return customer;
      }
    }
  }

  changeCustomer(ID) {
    const customer = this.getCurrentCustomer(ID);
    this.purchaseCount = customer.purchases.length;
    this.currentCustomerID = customer.customerID;
    this.totalPurchasesAmount();
    this.totalPoints();
    this.singleCustomerSummary();
    this.purchaseTableData.data = customer.purchases;
    return; 
  }

  singleCustomerSummary() {
    const customer = this.getCurrentCustomer();
    this.clearSummary('single');
    this.allCustomers = false;
    
    for (let purchase of customer.purchases) {
      let currentDate = moment();
      let purchaseDate = moment(purchase.purchaseDateString, 'MM-DD-YY');
      let difference = currentDate.diff(purchaseDate, 'days');
      if (difference <= 30) {
        this.singleThirtyPurchases += purchase.purchaseAmount;
        this.singleThirtyPoints += purchase.purchaseRewardPoints;
      } else if (difference <= 60) {
        this.singleSixtyPurchases += purchase.purchaseAmount;
        this.singleSixtyPoints += purchase.purchaseRewardPoints;
      } else if (difference <= 90) {
        this.singleNinetyPurchases += purchase.purchaseAmount;
        this.singleNinetyPoints += purchase.purchaseRewardPoints;
      } else {
        // Do nothing as it is out of scope
      }
    }

    this.formatSummary('single');

  }


  allCustomersSummary() {
    this.clearSummary('all');
    this.allCustomers = true;
    
    for (const customer of this.customerList) {
      for (let purchase of customer.purchases) {
        let currentDate = moment();
        let purchaseDate = moment(purchase.purchaseDateString, 'MM-DD-YY');
        let difference = currentDate.diff(purchaseDate, 'days');
        if (difference <= 30) {
          this.allThirtyPurchases += purchase.purchaseAmount;
          this.allThirtyPoints += purchase.purchaseRewardPoints;
        } else if (difference <= 60) {
          this.allSixtyPurchases += purchase.purchaseAmount;
          this.allSixtyPoints += purchase.purchaseRewardPoints;
        } else if (difference <= 90) {
          this.allNinetyPurchases += purchase.purchaseAmount;
          this.allNinetyPoints += purchase.purchaseRewardPoints;
        } else {
          // Do nothing as it is out of scope
        }
      }
    }
    this.allTotalPurchases = this.allThirtyPurchases + this.allSixtyPurchases + this.allNinetyPurchases;
    this.allTotalPoints = this.allThirtyPoints + this.allSixtyPoints + this.allNinetyPoints;
    this.formatSummary('all');
  }

  clearSummary(type: string) {
    switch(type) {
      case 'single':
        this.singleThirtyPurchases = 0;
        this.singleThirtyPoints = 0;
        this.singleSixtyPurchases = 0;
        this.singleSixtyPoints = 0;
        this.singleNinetyPurchases = 0;
        this.singleNinetyPoints = 0;
      case 'all':
        this.allThirtyPurchases = 0;
        this.allThirtyPoints = 0;
        this.allSixtyPurchases = 0;
        this.allSixtyPoints = 0;
        this.allNinetyPurchases = 0;
        this.allNinetyPoints = 0;
        this.allTotalPurchases = 0;
        this.allTotalPoints = 0;
    }
  }

  formatSummary(type: string) {
    switch(type) {
      case 'single':
        this.singleThirtyPurchases = Number(this.singleThirtyPurchases).toFixed(2);
        this.singleSixtyPurchases = Number(this.singleSixtyPurchases).toFixed(2);
        this.singleNinetyPurchases = Number(this.singleNinetyPurchases).toFixed(2);
      case 'all':
        this.allThirtyPurchases = Number(this.allThirtyPurchases).toFixed(2);
        this.allSixtyPurchases = Number(this.allSixtyPurchases).toFixed(2);
        this.allNinetyPurchases = Number(this.allNinetyPurchases).toFixed(2);
        this.allTotalPurchases = Number(this.allTotalPurchases).toFixed(2);
    }
  }

}
