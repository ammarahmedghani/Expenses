//fetching expense id from url
var expenseId = location.hash.substring(1, location.hash.length);

//initializing firebase services
var firestore = firebase.firestore();
var auth = firebase.auth();


//fetching expense whose id is in URL
var fetchSpecificExpense = async expenseId => {
  var expenseQuery = await firestore
    .collection("expenses")
    .doc(expenseId)
    .get();
  var expense = expenseQuery.data();
  return expense;
};


var editExpenseForm = document.querySelector("#editExpenseForm");
var updateHandler = async e => {
  e.preventDefault();
  var description = document.querySelector("#description").value.trim();
  var cost = document.querySelector("#cost").value.trim();
  var spentAt = document.querySelector("#spentAt").value.trim();
  if (description && cost && spentAt) {
    try {
      var updatedExpense = {
        description,
        cost: parseInt(cost),
        spentAt: new Date(spentAt)
      };
      //updaing expense with new data
      await firestore
        .collection("expenses")
        .doc(expenseId)
        .update(updatedExpense);
      //redirecting back to expense page
      history.back()
    } catch (error) {
      console.log(error)
    }
  }
};

auth.onAuthStateChanged(async user => {
  var expense = await fetchSpecificExpense(expenseId);

  //auto filling form
  var description = document.querySelector("#description");
  var cost = document.querySelector("#cost");
  var spentAt = document.querySelector("#spentAt");
  //  console.log(expense.spentAt.toDate().toISOString().split("T")[0])

  //setting up values
  description.value = expense.description;
  cost.value = expense.cost;
  //formating date to match yyyy-MM-dd
  //try console.log each step here
  spentAt.value = expense.spentAt
    .toDate()
    .toISOString()
    .split("T")[0];

  editExpenseForm.addEventListener("submit", e => {
    updateHandler(e);
  });
});
