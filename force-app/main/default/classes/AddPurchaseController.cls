public with sharing class AddPurchaseController {
    
    @AuraEnabled
    public static Boolean addPurchase(String budgetId, String pName, String pCategory, String pDate, String pCost){
        try {
            Purchase__c newPurchase = new Purchase__c(
                Budget__c = budgetId,
                Name = pName,
                Category__c = pCategory,
                Purchase_Date__c = Date.valueOf(pDate),
                Total_Cost__c = Decimal.valueOf(pCost)
            );

            insert newPurchase;

            if(!String.isEmpty(newPurchase.Id)) {
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<SelectOption> getPicklistOptions(){
        try {
            List<SelectOption> options = new List<SelectOption>();
            Schema.DescribeFieldResult fieldResult = Purchase__c.Category__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for(Schema.PicklistEntry f : ple) {
                options.add(new SelectOption(f.getLabel(), f.getValue()));
            }
            return options;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
