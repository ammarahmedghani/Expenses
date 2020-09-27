//initgializing firebase services
var auth = firebase.auth();
var firestore = firebase.firestore();

var userId = location.hash.substring(1, location.hash.length);
var arrayexpenses = [];
var expensesNode = document.querySelector(".expenses");
var filterbtn  = document.querySelector("#contact");
var spentAt = document.querySelector("#spentAt_to");


//redering filter expenses
var renderExpenses = arrayexpenses => {
  //removing all child nodes 
  expensesNode.innerHTML = "";

  for (var expense of arrayexpenses) {
  //pusing expense as a child in DOM
  //also setting-up id to expenseId to distinguish between expenses
    expensesNode.insertAdjacentHTML(
      "afterbegin",
      `<div class="expense flex">
    <h1>${expense.description}</h1>
    <h2>${expense.cost}</h2>

  </div>`
    );
  }
};




//function to filter expenses
var filter_expenses = async (e) => {
    e.preventDefault();
    var spentAt_from = document.querySelector("#spentAt_from").value.trim();
    var spentAt_to = document.querySelector("#spentAt_to").value.trim();

    //converting dates 
    var newdate1 = new Date(spentAt_from);
    var newdate2 = new Date(spentAt_to);
 
    //query to filter dates   
   var expenseQuery = await firestore
    .collection("expenses")
    .orderBy("spentAt").where("userId","==",userId)
    .where("spentAt",">=",newdate1).where("spentAt","<=",newdate2)
    .get();

    expenseQuery.forEach(doc => {
        //{object containig expense data & also adding expenseId}
        arrayexpenses.push({...doc.data(), expenseId: doc.id });
      });
      renderExpenses(arrayexpenses);
    }
  
     // console.log(arrayexpenses);
    




filterbtn.addEventListener("submit", e => {
    filter_expenses(e);
})