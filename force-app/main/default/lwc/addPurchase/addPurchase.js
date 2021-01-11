import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addPurchase from '@salesforce/apex/AddPurchaseController.addPurchase';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import PURCHASE_OBJECT from '@salesforce/schema/Purchase__c';
import CATEGORY_FIELD from '@salesforce/schema/Purchase__c.Category__c';

export default class AddPurchase extends LightningElement {

    @api recordId;
    @track resultText;
    data;
    name;
    date;
    cost;
    category;
    
    @wire(getObjectInfo, { objectApiName: PURCHASE_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD})
    options;

    async addPurchase() {
        const isSuccess = await addPurchase({
            budgetId: this.recordId,
            pName: this.name,
            pCategory: this.category,
            pDate: this.date,
            pCost: this.cost
        });

        if(isSuccess) {
            this.resultText = 'Purchase added successfully';
            this.showNotification('Successful', 'Purchase added successfully', true);
        } else {
            this.showNotification('Error', 'There was an error while trying to add a new Purchase', false);
        }
    }

    handleNameInput(event) {
        this.name = event.target.value;
    }

    handleDateInput(event) {
        this.date = event.target.value;
    }

    handleCategoryChange(event) {
        this.category = event.detail.value;
    }

    handleCostInput(event) {
        this.cost = event.target.value;
    }

    showNotification(title, message, isSuccess) {
        var variant = 'success';
        if(isSuccess){
            variant = 'success';
        } else {
            variant = 'error';
        }
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}