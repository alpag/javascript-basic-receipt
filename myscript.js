console.log("PAWELSKI PROGRAMISTA 15K SOON");

$(document).ready(function(){
    class item {
        constructor(name, quantity, price) {
            this.name = name;
            this.quantity = Math.round(quantity * 100)/100;
            this.price = (+price).toFixed(2);
            this.sum = (+(quantity * price)).toFixed(2);
        }
        refreshSum(){
            this.sum = (+(this.quantity * this.price)).toFixed(2);
        }
    }

    var items = [];
    var loadedItems = localStorage.getItem("items");
    itemsBefore = JSON.parse(loadedItems);
    console.log(itemsBefore);
    for(let i = 0; i< itemsBefore.length; i++){
        var newItem = new item(itemsBefore[i].name, itemsBefore[i].quantity, itemsBefore[i].price);
        items.push(newItem);
    }
    refreshView();
    

    function addTaskItems(){
        items.push(new item("Jabłka", 1.5, 4.90));
        items.push(new item("Bułka", 5, 0.49));
    }
    //addTaskItems();


    $( "#itemContainer" ).sortable({
        update: function(event, ui) {
            let newArr = [];
            var newPos = 0;
           $(".element").each(function() {
                let index = $(this).children(":first").text();
                var item = items[index-1];
                newArr.splice(newPos++, 0, item);
            });
            items = newArr;
            refreshView();
        }
    });

    $( "#itemContainer" ).disableSelection();
    
    function refreshView(){
        $("tr").remove(".element");
        $("tr").remove("#summary");

        var idx = 0;
        items.forEach(element => {
        var newElement = $("#pattern").clone();
        newElement.css('visibility', 'visible');
        newElement.find(".name").text(element.name);
        newElement.find(".quantity").text(element.quantity);
        newElement.find(".price").text(element.price + " zł");
        newElement.find(".sum").text(element.sum + " zł");
        newElement.find(".no").text(++idx);
        newElement.attr("class", "element");
        $("#itemContainer").append(newElement);
        });
        createSummary();
        myJSON = JSON.stringify(items);
        localStorage.setItem("items", myJSON);
    }

    function getTotal(){
        var total = 0;
        items.forEach(element => {
            total = parseFloat(total) + parseFloat(element.sum);
        });
        return total.toFixed(2);
    }

    function createSummary(){
        var summary = $("<tr></tr>").attr("id", "summary");
        var total = $("<td></td>").text("RAZEM").attr("class", "razem").attr("colspan", "4");
        var totalcount = $("<td></td>").text(getTotal() + " zł").attr("class", "razem");
        summary.append(total).append(totalcount).insertAfter("#itemContainer");
    }
      
    $("#addItem").submit(function(){
        if(!validate($("#priceToAdd").val())){
            alert("Cena musi być liczbą!")
            return;
        }

        if(!validate($("#quantityToAdd").val())){
            alert("Ilość musi być liczbą!")
            return;
        }
        var newItem = new item($("#nameToAdd").val(), $("#quantityToAdd").val(), $("#priceToAdd").val());
        items.push(newItem);
        refreshView();
        return false;
    });

    function validate(value){
        if(isNaN(Math.round(value)*100)/100 || value<=0){
            return false;
        }
        return true;
    }
    
    $(document).on("click", "#delbtn", function(){
        let index = $(this).parent().parent().children(":first").text();
        items.splice(index-1, 1);
        console.log(items)
        refreshView();
    })

    $(document).on("click", "#upbtn", function(){
        let index = $(this).parent().parent().children(":first").text();
        items.splice(index-1, 1);
        console.log(items)
        refreshView();
    })

    $(document).on("dblclick", "td", function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(['no', 'sum', 'razem', 'btns'].includes(this.getAttribute('class')))
            return;
        var index = $(this).parent().children(":first").text();
        this.innerHTML = null;
        var temp = this;
        if(this.getAttribute('class') == 'name')
            var value = items[index-1].name;
        else if(this.getAttribute('class') == 'quantity')
            var value = items[index-1].quantity;
        else
            var value = items[index-1].price;
        var inputField = $("<input></input>").attr("value", value);
        $(this).append(inputField);
        $(document).on("dblclick", function(){
            if(temp.getAttribute('class') == 'name')
                items[index-1].name = $(inputField).val();
            else if(temp.getAttribute('class') == 'quantity'){
                if(!validate($(inputField).val())){
                    alert("Ilość musi być liczbą!")
                    return;
                }
                items[index-1].quantity = $(inputField).val();
            }
            else
            {
                if(!validate($(inputField).val())){
                    alert("Cena musi być liczbą!")
                    return;
                }
                items[index-1].price = $(inputField).val();
            } 
            $(inputField).remove();
            console.log(index)
            console.log(items)
            items[index-1].refreshSum();
            refreshView();
        })
    });
});