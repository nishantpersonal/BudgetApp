var budgetController=(function(){
    
    var Expense=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
    };
    var Income=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
    };
    
   
})();


var UIController=(function(){
    
    var DOMstrings={
        inputType:'.add__type',
        intputDesc:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'
    };
   
    return{
        
        getInput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                desc:document.querySelector(DOMstrings.intputDesc).value,
                value:document.querySelector(DOMstrings.inputValue).value
                };
            },
        getDOMStrings:function(){
            return DOMstrings;
        }
    };
    
    
})();


var appController=(function(bdgtCntrl,UICntrl){
    
    
    var setupEventListners=function(){
         var DOM=UICntrl.getDOMStrings();
         document.querySelector(DOM.inputBtn).addEventListener('click',newItem);

         document.addEventListener('keypress',function(event){
           if(event.keyCode===13||event.which===13)
               newItem();
        });
    }

    var newItem=function(){
        var input=UICntrl.getInput();
        
    }
    return {
        init:function(){
            setupEventListners();
        }
    }
    
})(budgetController,UIController);

appController.init();