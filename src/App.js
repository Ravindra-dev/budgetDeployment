import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";

// localStorage.getItem('item name')
// localStorage.setItem('item name')

// const initialExpenses = [
//   { id: uuidv4(), charge: "rent", amount: 1600 },
//   { id: uuidv4(), charge: "car payment", amount: 400 },
//   { id: uuidv4(), charge: "credit card bill", amount: 1200 },
// ];

const initialExpenses = localStorage.getItem('expenses') 
  ? JSON.parse(localStorage.getItem('expenses'))
  : []

// console.log(initialExpenses);
function App() {
  // **************** state values *******************
  //  all expenses add expense
  const [expenses, setExpenses] = useState(initialExpenses);

  //  single expense
  const [charge, setCharge] = useState("");

  //  single amount
  const [amount, setAmount] = useState("");

  // edit
  const [edit, setEdit] = useState(false)

  // edit item
  const [id, setId] = useState(0)

  //  alert
  const [alert, setAlert] = useState({ show: false });

  // **************** useEffect *******************
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  // **************** fuctionality *******************

  // handle cahrge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  // hanlde amount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  // handle alert

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if(edit){
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {...item,charge,amount} : item
        })
        setExpenses(tempExpenses)
        setEdit(false)
        handleAlert({ type: "success", text: "Item edited successfully" });
      }else{
        setExpenses([...expenses, { id: uuidv4(), charge: charge, amount: amount },]);
        handleAlert({ type: "success", text: "Item added successfully" });
      }
      setCharge("");
      setAmount("");
    } else {
      // alert
      if (charge === "" && amount === "") {
        handleAlert({type:'danger', text:'charge and amount should not be empty....'})
      }else if(charge === ""){
        handleAlert({type:'danger', text:'charge should not be empty....'})
      }else if(amount===''){
        handleAlert({type:'danger', text:'amount should not be empty ....'})
      }
    }
  };

  //  clear all items
  const clearItems = () => {
    setExpenses([])
    handleAlert({type:'danger', text:' all item deleted'})
  }

  //  handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item =>item.id !== id) 
    setExpenses(tempExpenses)
    handleAlert({type:'danger', text:'Item deleted'})
    
  }

  //  handle Edit
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge, amount} = expense
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}

      <h1>love calculator</h1>
      <main className="App">

        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />

        <ExpenseList 
        expenses={expenses} 
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        clearItems={clearItems} />


      </main>

      
      <h1>
        total spendings :
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>


    </>
  );
}

export default App;
