// Tracalorie Project with The Module Pattern

//STORAGE CONTROLLER
//Local storage sayesinde sayfa reload yapılsa bile UI'daki item'lar kaybolmaz.
const StorageCtrl=(function(){

    //Public methods
    return{
        storeItem:function(item){
            let items;
            //Check if any items in ls
            if(localStorage.getItem('items')===null){
                items=[]; //items is an empty array
                //Push new item
                items.push(item);
                //Set ls
                //JavaScript to JSON
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                //Get what is already in ls
                //JSON to JavaScript
                items=JSON.parse(localStorage.getItem('items'));

                //Push new Item
                items.push(item);

                //Re set ls
                localStorage.setItem('items',JSON.stringify(items));

            }

        },

        getItemsFromStore:function(){

            let items;
            if(localStorage.getItem('items')===null){
                items=[]; //items is an empty array
            }else{
                //JSON to JavaScript
                items=JSON.parse(localStorage.getItem('items'));
            }

            return items;

        },

        updateItemStorage:function(updatedItem){

            let items=JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
              if(updatedItem.id===item.id){
                  
                  //splice metodu orjinal array'i değiştirir.
                  //array'den 1 tane item silinir ve onun yerine updatedItem eklenir.
                  items.splice(index,1,updatedItem); 
                  
              }
            });

            localStorage.setItem('items',JSON.stringify(items));

        },

        deleteItemFromStorage:function(id){
            let items=JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(id===item.id){
                    //array'den 1 tane item silinir. 
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items',JSON.stringify(items));

        },

        clearItemsFromStorage:function(){
            localStorage.removeItem('items');
        },
           
    }


})();

 
//ITEM CONTROLLER
const ItemCtrl= (function(){
    //Private Zone

    //Item Constructor 
    const Item=function(id,name,calories){ //Item Class
        this.id=id;
        this.name=name;
        this.calories=calories;

    }

    //Data Structure / State

    //Data Object
    const data={
        
       /*   items:[   //array
            {id:0,name:'Steak Dinner',calories:1200},
            {id:1, name: 'Cookie',calories:400},
            {id:2, name:'Eggs', calories:300}  
        ],
    */

        //Beginning
        items:StorageCtrl.getItemsFromStore(),
        currentItem:null, //null=no data
        totalCalories:0
    }

    
    //Public Methods

    return{

        
        getItems:function(){
             return data.items;
        },

        //Yen bir item oluşturulur ve array'e kaydedilir.
        addItem:function(name,calories){

            let ID;

            //Create ID
            if(data.items.length>0){
                ID=data.items[data.items.length-1].id+1; //son elemanın id'sinin 1 fazlası ID olur.
            }else{
                ID=0; //eleman yok demektir, birinci eleman array'e eklenmiş olur.
            }

            //Calories to number
            calories=parseInt(calories); //converts string to integer number
           
            //Create new item
            newItem=new Item(ID,name,calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        //İstenilen id'ye sahip olan item bulunur.
        getItemById:function(id){
            let found=null;
            //Loop through items
            data.items.forEach(function(item){
                if(item.id===id){
                    found=item;
                }
            });
            return found;
        },
        //name ve calories bilgileri update edildi.
        updateItem:function(name,calories){
           //Calories to number
           calories=parseInt(calories);

           let found=null;

           //İstenilen item değeri update edildi.
           data.items.forEach(function(item){
               if(item.id===data.currentItem.id){
                   item.name=name;
                   item.calories=calories;
                   found=item;
               }
           });
           return found;
        },

        deleteItem:function(id){
            //Get ids
            //array'in item'ları id bilgileri ile döndürülür,
            //böylece ids adında yeni bir array oluşturulmuş olur.
            const ids=data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index=ids.indexOf(id);

            //Remove item
            data.items.splice(index,1); //start:index, delete count:1
        },

        clearAllItems:function(){
            data.items=[];
        },

        setCurrentItem:function(item){
            data.currentItem=item;
        },

        getCurrentItem:function(){
            return data.currentItem;
        },

        getTotalCalories:function(){
             let total=0;

             //Loop through items and add cals
             data.items.forEach(function(item){
                 total+=item.calories;
             });

             //Set total cal in data object
             data.totalCalories=total;

             //Return total
             return data.totalCalories;
        },

        logData:function(){
            return data;
        }
    }
})();



//UI CONTROLLER
const UICtrl=(function(){

    //UISelectors Object
    const UISelectors={

        itemList:'#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories'
      
    }

    //Public Methods
    return{

      //data.item'daki item'lar loop ile UI'da listelenir.
        populateItemList:function(items){
            
          let html='';

          //forEach Loop
          //Var olan item'lar döngüye sokularak sıralanır.
          items.forEach(function(item){
              html+=`<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}:</strong><em>${item.calories} Calories</em> 
              <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
              </li>`;
          });

          //Insert List Items
          document.querySelector(UISelectors.itemList).innerHTML=html;

      },

        getItemInput:function(){
           return {
               name:document.querySelector(UISelectors.itemNameInput).value,
               calories:document.querySelector(UISelectors.itemCaloriesInput).value
           }
       },

      //Yeni item listeye eklenir.
       addListItem:function(item){
         //Show the list
         document.querySelector(UISelectors.itemList).style.display='block';
         //Create li element
         const li=document.createElement('li');
         //Add class
         li.className='collection-item';
         //Add ID
         li.id=`item-${item.id}`;
         //Add HTML
         li.innerHTML=`
         <strong>${item.name}:</strong><em>${item.calories} Calories</em> 
         <a href="#" class="edit-item secondary-content">
         <i class="edit-item fa fa-pencil"></i></a>`;
         //Insert item
         document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li); //komşu element ekleme
       }, 

       //Yeni name ve calories özellikleri update edildi, UI'da gösterildi.
       updateListItem:function(item){
          let listItems=document.querySelectorAll(UISelectors.listItems);
          
          // Turn Node list into array
          listItems=Array.from(listItems);

          //Loop through array
          listItems.forEach(function(listItem){

            const itemID = listItem.getAttribute('id'); //item'ların id'leri ele alındı.

            if(itemID === `item-${item.id}`){
              document.querySelector(`#${itemID}`).innerHTML = `
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>`;
            }
          });
       },
       
       deleteListItem:function(id){
           const itemID=`#item-${id}`;
           const item=document.querySelector(itemID);
           item.remove(); //removes node

       },

       clearInput:function(){
           document.querySelector(UISelectors.itemNameInput).value='';
           document.querySelector(UISelectors.itemCaloriesInput).value='';

       },
       //Edit olacak olan item'ın name ve calories değerleri UI'a aktarıldı.
       addItemToForm:function(){
           document.querySelector(UISelectors.itemNameInput).value=
           ItemCtrl.getCurrentItem().name; //return data.currentItem.name
           document.querySelector(UISelectors.itemCaloriesInput).value=
           ItemCtrl.getCurrentItem().calories;
           UICtrl.showEditState();

       },
       removeItems:function(){
           let listItems=document.querySelectorAll(UISelectors.listItems);

           //Turn node list into array
           listItems=Array.from(listItems);

           //Loop yardımyla listedeki tüm elemanlar silindi.
           listItems.forEach(function(item){
               item.remove(); //removes node
           });

       },

       hideList:function(){
            document.querySelector(UISelectors.itemList).style.display='none';

       },

       showTotalCalories:function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent=totalCalories;
       },

       clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline'; // inline element, sonrasına bir boşluk bırakmaz.
      },
      //Edit için kullanılacak olan butonlar aktifleştirildi.
      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },

       getSelectors:function(){
           return UISelectors;
       }

    }
})();


//APP CONTROLLER
//ItemCtrl sayesinde data'yı parametre olarak aldı.
const AppCtrl=(function(StorageCtrl,ItemCtrl,UICtrl){

    //Load event listeners
    const loadEventListeners=function(){

    //Get UI selectors
    const UISelectors=UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click',
    itemAddSubmit);

    
    // Disable submit on enter
    //Enter ile item ekleme engellendi.
    document.addEventListener('keypress', function(e){

        //for internet explorer:keyCode
        //for modern browsers:which
        if(e.keyCode === 13 || e.which === 13){ //ASCII of enter =13
          e.preventDefault();
          return false;
        }
      });

     // Edit icon click event
     document.querySelector(UISelectors.itemList).addEventListener('click', itemEdit);

     //Update item event
     document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

     //Delete item event
     document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

     //Back button event
     document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

     //Clear items event
     document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItems);

    }

    //Add item submit
    const itemAddSubmit=function(e){
        
      //Get form input from UI Controller
      const input=UICtrl.getItemInput(); // get name and calories

        //Check for name and calorie input
        if(input.name!== '' && input.calories!==''){
          
            //Add item to the data
            const newItem=ItemCtrl.addItem(input.name, input.calories); //return newItem

            //Add item to UI list
           UICtrl.addListItem(newItem);

           //Get total calories
           const totalCalories=ItemCtrl.getTotalCalories(); //return data.totalCalories

           //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            //Bu sayede  eklenen item reload yapıldığı zaman kaybolmayacak.
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }   

            e.preventDefault();

 
    }
      // Click edit item
    const itemEdit = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      //item-0 string ifadesi, item ve 0 olarak split metodu yardımıyla bölünür ve böylece bir array oluşturulmuş olur.
      const listIdArr = listId.split('-');

      // Get the actual id
      //listIdArr[0]=item
      //listIdArr[1]=0
      const id = parseInt(listIdArr[1]); // integer:0

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id); //return found

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit); //data.currentItem=item;

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  //Update item submit
  const itemUpdateSubmit=function(e){
      //Get item new inputs
      const input=UICtrl.getItemInput(); //get new name and calories from UI
      //Update item
      const updatedItem=ItemCtrl.updateItem(input.name,input.calories);

      //Update UI
      UICtrl.updateListItem(updatedItem);

      //Get total calories
      const totalCalories=ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.updateItemStorage(updatedItem);

      UICtrl.clearEditState();

      e.preventDefault();
  }

  //Delete button event
  const itemDeleteSubmit=function(e){
      //Get current item
      const currentItem=ItemCtrl.getCurrentItem(); //return data.currentItem

      //Delete from data structure
      ItemCtrl.deleteItem(currentItem.id);

      //Delete from UI
      UICtrl.deleteListItem(currentItem.id);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.deleteItemFromStorage(currentItem.id);

      UICtrl.clearEditState();

      e.preventDefault();
  }

   // Clear items event
   const clearAllItems = function(){

    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Remove from UI
    UICtrl.removeItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();
    
  }

    //Public Methods
    return{
        init:function(){

            //Clear edit state / set initial set
            UICtrl.clearEditState();

            //Fetch items from data object
            //Item'lar data'dan alınır.
            const items=ItemCtrl.getItems();  // return data.items

            //Check if any items
            if(items.length===0){
                UICtrl.hideList();

            }else{
                //Populate list with items
                //Item listesi UI'da oluşturulur.
                UICtrl.populateItemList(items);
            } 

             //Get total calories
            const totalCalories=ItemCtrl.getTotalCalories(); //return data.totalCalories
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load Event listeners
            //Yeni item oluşturulur ve items array'ine kaydedilir.
            loadEventListeners();

        }
    }

    })(StorageCtrl,ItemCtrl,UICtrl);

      

//Initialize App
AppCtrl.init();

           
    
      




