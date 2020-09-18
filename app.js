var budgetController=(function(){
    
    var Expense=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
        this.percentage=-1;
    };
    
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else
            this.percentage=-1;
    };
    
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };
    var Income=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
    };
    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type] = sum;
    }
    
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    
    return{
        
         addItem:function(type,desc,value){
            var newItem,ID;
            
            //Determinig id of next item by incrementing 1 to the id of last element of the array
            if(data.allItems[type].length>0)
                ID=data.allItems[type][data.allItems[type].length-1].id + 1;
             else
                ID=0;
            
            if(type==='inc'){
                newItem=new Income(ID,desc,value);
            }
             else if(type==='exp'){
                 newItem=new Expense(ID,desc,value);
            }
            data.allItems[type].push(newItem);  
             
            return newItem;
        },
        
        deleteItem:function(type,ID){
            
            var ids,index;
            
            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            
            index=ids.indexOf(ID);
            
            if(index!==-1){
                data.allItems[type].splice(index,1);
            }
            
        },
        
        calculateBudget:function(){
           calculateTotal('exp');
           calculateTotal('inc');
            
           data.budget=data.totals.inc-data.totals.exp;
           
           if(data.totals.inc>0)
                data.percentage=Math.round((data.totals.exp)*100/data.totals.inc);
            
        },
        calculatePercentages:function(){
            
        data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
            
        },
        
        getPercentages:function(){
            var allPer=data.allItems.exp.map(function(current){
               return current.getPercentage(); 
            });
            return allPer;
        },
        testing:function(){
            return data;
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalIncome:data.totals.inc,
                totalExpense:data.totals.exp,
                percentage:data.percentage
            };
        }
    }
    
   
})();


var UIController=(function(){
    
    var DOMstrings={
        inputType:'.add__type',
        intputDesc:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel:'.item__percentage',
        monthAndYearLabel:'.budget__title--month'
    };
    
    var formatNumber=function(number,type){
            var numberSplit,int ,dec;
            //Removing any signs if present
            number=Math.abs(number);
            
            number=number.toFixed(2);
            
            numberSplit=number.split('.');
            
            int=numberSplit[0];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
            }
            
            dec=numberSplit[1];
            
            return (type==='exp'?'-':'+')+' '+int+'.'+dec;
        };
   
    return{
        
        getInput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                desc:document.querySelector(DOMstrings.intputDesc).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
                };
            },
        
        addListItem:function(obj,type){
            var html,newHtml,element;
            //html string with placeholders
            if(type==='inc'){
                element=DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element=DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //placeholders replaced with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.desc);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //inserting html as child component
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        deleteListItem:function(selectorId){
            
            var element=document.getElementById(selectorId);
            
            element.parentNode.removeChild(element);
            
        },
        
        clearInputs:function(){
            
            var fields,fieldsArr;
            
            fields=document.querySelectorAll(DOMstrings.intputDesc+','+DOMstrings.inputValue);
            
            fieldsArr=Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });
            
            fieldsArr[0].focus();
            
        },
        
        displayBudget:function(obj){
            var type;
            
            obj.budget>=0?type='inc':type='exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=
                formatNumber(obj.totalIncome,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent=
                formatNumber(obj.totalExpense,'exp');
            
            if(obj.percentage>0)
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage + '%';
            else    
                document.querySelector(DOMstrings.percentageLabel).textContent='---';
                    
        },
        
        displayPercentages:function(percentages){
            var fields=document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
            var nodeListForEach=function(list,callback){
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
                }  
            };
            
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0)
                    current.textContent=percentages[index] + '%';
                else
                    current.textContent='---';
            })
            
        },
        
        displayMonth:function(){
            var now,year,month,months;
            months=['January','February','March','April','May','June','July','August','September',
                   'October','November','December'];
            now=new Date();
            
            year=now.getFullYear();
            
            month=now.getMonth();
            
            document.querySelector(DOMstrings.monthAndYearLabel).textContent=months[month]+' '+year;
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
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    
    var updatePercentages=function(){
        
        bdgtCntrl.calculatePercentages();
        
        var percentages=bdgtCntrl.getPercentages();
        
        UICntrl.displayPercentages(percentages);
        
    };
    
    var updateBudget=function(){
        
        bdgtCntrl.calculateBudget();
        
        var budget=bdgtCntrl.getBudget();
        
        UICntrl.displayBudget(budget);
    };

    var newItem=function(){
        var input=UICntrl.getInput();
        
        if(input.desc!==""&&!isNaN(input.value)&&input.value>0){
             var newItem=bdgtCntrl.addItem(input.type,input.desc,input.value);

            UICntrl.addListItem(newItem,input.type);
            
            UICntrl.clearInputs();
            
            updateBudget();
            
            updatePercentages();
        }
    
    };
    
    var ctrlDeleteItem=function(event){
        var itemId,splitId,type,ID;
        
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){

            splitId=itemId.split('-');

            type=splitId[0];

            ID=parseInt(splitId[1]);

            bdgtCntrl.deleteItem(type,ID);
            
            UICntrl.deleteListItem(itemId);
            
            updateBudget();
            
            updatePercentages();
        
        }
        
    }
    
    return {
        init:function(){
            UICntrl.displayBudget({
                budget:0,
                totalIncome:0,
                totalExpense:0,
                percentage:-1
            });
            UICntrl.displayMonth();
            setupEventListners();
        }
    }
    
})(budgetController,UIController);

appController.init();