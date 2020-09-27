//initgializing firebase services
var auth = firebase.auth();
var firestore = firebase.firestore();
//fetching user id from url
var userId = location.hash.substring(1, location.hash.length);
//fetching parent node of all expenses
var expensesNode = document.querySelector(".expenses");
var filterdates = document.querySelector(".btn");

var totalCost = 0;
var totalCostNode = document.querySelector(".totalCost");

var renderExpenses = expenseArr => {
  //removing all child nodes 
  expensesNode.innerHTML = "";

  for (var expense of expenseArr) {
  //pusing expense as a child in DOM
  //also setting-up id to expenseId to distinguish between expenses
    expensesNode.insertAdjacentHTML(
      "afterbegin",
      `<div class="expense flex">
    <h1>${expense.description}</h1>
    <h2>${expense.cost}</h2>
    <div id=${expense.expenseId} class="edit btn">EDIT</div>
    <div id=${expense.expenseId} class="delete btn">DELETE</div>
  </div>`
    );
  }
};

var fetchExpenses = async () => {
  var expenses = [];
  //fetching expenses from firestore
  var expensesQuery = await firestore
    .collection("expenses")
    .where("userId", "==", userId)
    .orderBy("spentAt", "desc")
    .get();

  expensesQuery.forEach(doc => {
    //{object containig expense data & also adding expenseId}
    expenses.push({ ...doc.data(), expenseId: doc.id });
  });
  return expenses;
};




var addExpense = async e => {
  e.preventDefault();
  var description = document.querySelector("#description").value.trim();
  var cost = document.querySelector("#cost").value.trim();
  var spentAt = document.querySelector("#spentAt").value.trim();
  if (description && cost && spentAt) {
    var expenseObj = {
      description,
      cost: parseInt(cost),
      spentAt: new Date(spentAt),
      userId
    };
    //saving expense object created above in firestore
    await firestore.collection("expenses").add(expenseObj);
    //fetching and rendering
    var expenses = await fetchExpenses();
    renderExpenses(expenses);
    sumCalculator(expenses);
    $(".mini.modal.m1Form").modal("hide");
  }
};


var deleteHandler = async expenseId => {
  await firestore
    .collection("expenses")
    .doc(expenseId)
    .delete();
  var expenses = await fetchExpenses();
  renderExpenses(expenses);
  sumCalculator(expenses);
};

var sumCalculator = expenseArr => {
  //setting initial cost to 0
  totalCost = 0;
  for (var expense of expenseArr) {
    totalCost += expense.cost;
  }
  totalCostNode.textContent = `${totalCost} RS`;
};

auth.onAuthStateChanged(async user => {
  //checking via server the existing of user (security check)
  if (user.uid === userId) {
    var userNameNode = document.querySelector(".userName");
    userNameNode.textContent = userNameNode.displayName;

    //rendering data
    var expenses = await fetchExpenses();
    renderExpenses(expenses);
    sumCalculator(expenses);

    expensesNode.addEventListener("click", async e => {
      if (e.target.classList[0] === "edit") {
        var expenseId = e.target.id;
        location.assign(`editexpences.html#${expenseId}`);
      } else if (e.target.classList[0] === "delete") {
        var expenseId = e.target.id;
        deleteHandler(expenseId);
      }
    });

    //attaching lister to add expense form
    var addExpenseForm = document.querySelector("#addExpenseForm");
    addExpenseForm.addEventListener("submit", e => {
      addExpense(e);
    });
  }
});

filterdates.addEventListener("click",()=>{
  location.assign(`filtetrexpense.html#${userId}`);
})

//add expense modal opening code
var add = document.querySelector(".add");
add.addEventListener("click", () => {
  $(".mini.modal.m1Form").modal("show");
});