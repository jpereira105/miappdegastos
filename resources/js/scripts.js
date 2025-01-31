const form = document.getElementById("transactionForm");
     
form.addEventListener("submit", function(event) {
   event.preventDefault(); // se cancela el evento no se envia al servidor
   let transactionFormData = new FormData(form);
   let transactionObj = ConvertFormDataToTransactionObj(transactionFormData);
   saveTransactionObj(transactionObj);
   insertRowInTransactionTable(transactionObj);
   form.reset();           
})

// carga las categorias a un array y ejecuta funcion insertCategory 
// que lo carga en el html
function draw_category() {
    let allCategories = [
        "Alquiler","Comida","Diversion","Antojo","Gasto","transporte","Salario" 
    ]
    for (let index = 0; index < allCategories.length; index++) {
        insertCategory(allCategories[index])
    }
}

function insertCategory(categoryName) {
    const selectElement = document.getElementById("transactionCategory")
    let htmlToInsert = `<option> ${categoryName} </option>`
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert) 
}

function isValidTransactionForm(transactionObj) {
    let isValidForm = true;
    if (!transactionObj["transactionType"]) {
        alert("Tu transaction type no es valido. ponele algo")
        isValidForm = false;
    }
    
    if (!transactionObj["transactionDescription"]) {
        alert("Debes colocar algo en el transaction description")
        isValidForm = false;
    }
    
    if (!transactionObj["transactionAmount"]) {
        alert("Debes colicar un monto")
        isValidForm = false;
    } else if (transactionObj["transactionAmount"] < 0) {
        alert("No puedes poner numeros negativos")
        isValidForm = false;
    }
    
    if (!transactionObj["transactionCategory"]) {
        alert("Debes colocar una categoria")
        isValidForm = false;
    }
    return isValidForm;
}
    
document.addEventListener("DOMContentLoaded", function(event) {
    draw_category()
    let transactionArr = JSON.parse(localStorage.getItem("transactionData"));
if (!Array.isArray(transactionArr)) {
         transactionArr = []; 
    }
    console.log(localStorage.getItem("transactionData"));
    transactionArr.forEach(
        function(arrayElement) {
            insertRowInTransactionTable(arrayElement)
        }
    )        
})
         
// agrega el id del registro
function getNewTransacitionId () {
   let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"
   let newTransactionId =  JSON.parse(lastTransactionId) + 1;
   localStorage.setItem("lastTransactionId",JSON.parse(newTransactionId))
   return newTransactionId;
} 


function ConvertFormDataToTransactionObj(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    let transaccionId = getNewTransacitionId() ;
    return {
        "transactionType": transactionType,
        "transactionDescription": transactionDescription,
        "transactionAmount": transactionAmount,
        "transactionCategory": transactionCategory,
        "transaccionId": transaccionId
    };        
}

function insertRowInTransactionTable(transactionObj) {
    let transactionTableRef = document.getElementById("transactionTable");
   
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
    newTransactionRowRef.setAttribute("data-transaction-Id",transactionObj["transaccionId"]);
    
    let newTypeCellRef = newTransactionRowRef.insertCell(0);
    newTypeCellRef.textContent = transactionObj.transactionType;
    
    newTypeCellRef = newTransactionRowRef.insertCell(1);
    newTypeCellRef.textContent = transactionObj.transactionDescription;
    
    newTypeCellRef = newTransactionRowRef.insertCell(2);
    newTypeCellRef.textContent = transactionObj.transactionAmount;

    newTypeCellRef = newTransactionRowRef.insertCell(3);
    newTypeCellRef.textContent = transactionObj.transactionCategory;

    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton)
    
    deleteButton.addEventListener("click", (event) => {
        // tengo la fila que quiero borrar
        let transactionRow = event.target.parentNode.parentNode;
        console.log(transactionRow)
        // tomo el valor del atributo "data-transaction-Id" el Id 
        let transaccionId = transactionRow.getAttribute("data-transaction-Id"); 
        console.log(transaccionId)
        // console.log(transactionRow.getAttribute("data-transaction-id"))
        // elimina la fila del html
        transactionRow.remove();
        // elimina la fila del localStorage
        deleteTransactionObj(transaccionId);
    })
}

//le paso como parametro el transactionId de la transaccion que quiero eliminar
function deleteTransactionObj(transaccionId) {
    // obtengo lo que hay en mi db (Desconvierto de json a obj)
    // obtiene todas las transacciones del localStorage
    let transactionArr = JSON.parse(localStorage.getItem("transactionData"));
    // busco indice o posicion de la transaccion que quiero eliminar
    let transaccionIndexInArray = transactionArr
        .findIndex(element => element.transaccionId === transaccionId) || [];
    // elimino el elemento de esa posicion ,1 me borrra un solo elemento
    transactionArr.splice(transaccionIndexInArray, 1);
    // convierto el obj a json
    let transactionArryJSON = JSON.stringify(transactionArr);
    // guardo mi array de transacciones en formato json en localstorage
    localStorage.setItem("transactionData", transactionArryJSON);          
}    

    function saveTransactionObj(transactionObj) {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    if (!Array.isArray(myTransactionArray)) {
         myTransactionArray = []; 
    }
    myTransactionArray.push(transactionObj);
    // convierto mi array de transaccion a Json
    let transactionArryJSON = JSON.stringify(myTransactionArray);
    // guardo mi array de transacciones en formato json en localstorage
    localStorage.setItem("transactionData", transactionArryJSON);          
}
