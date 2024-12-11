import React, { useEffect, useState } from "react";
import { Card, Row, Button } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import TransactionSearch from "./TransactionSearch";
import Header from "./Header";
import AddIncomeModal from "./Modals/AddIncome";
import AddExpenseModal from "./Modals/AddExpense";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import "./raju.css"

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [selectedChartType, setSelectedChartType] = useState("spending");

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};
    const incomeData = {};
    const expenseData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance += transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }

        if (incomeData[tag]) {
          incomeData[tag] += transaction.amount;
        } else {
          incomeData[tag] = transaction.amount;
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -= transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }

        if (expenseData[tag]) {
          expenseData[tag] += transaction.amount;
        } else {
          expenseData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    const incomeDataArray = Object.keys(incomeData).map((key) => ({
      category: key,
      value: incomeData[key],
    }));

    const expenseDataArray = Object.keys(expenseData).map((key) => ({
      category: key,
      value: expenseData[key],
    }));

    return { balanceData, spendingDataArray, incomeDataArray, expenseDataArray };
  };

  const { balanceData, spendingDataArray, incomeDataArray, expenseDataArray } = processChartData();

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
      payment:values.payment,
    };

    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    calculateBalance();
  };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const getPieChartData = () => {
    switch (selectedChartType) {
      case "income":
        return incomeDataArray;
      case "expenses":
        return expenseDataArray;
      case "spending":
      default:
        return spendingDataArray;
    }
  };

  const pieChartConfig = {
    data: getPieChartData(),
    angleField: "value",
    colorField: "category",
  };

  function reset() {
    console.log("resetting");
  }

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className='line' >
      <Link  to="/pricing"> <p>🏳️For uninterrupted solutions check out our exciting plans‼️🏳️</p></Link>
       </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Cards
            currentBalance={currentBalance}
            income={income}
            expenses={expenses}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            cardStyle={cardStyle}
            reset={reset}
          />

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>PIE CHART ANALYSIS</h2>
                  <h2>
                    <Button
                      type={selectedChartType === "spending" ? "primary" : "default"}
                      onClick={() => setSelectedChartType("spending")}
                    >
                      Total Spending
                    </Button>
                    <Button
                      type={selectedChartType === "income" ? "primary" : "default"}
                      onClick={() => setSelectedChartType("income")}
                    >
                      Income
                    </Button>
                   
                  </h2>
                  {getPieChartData().length === 0 ? (
                    <p>Seems like you haven't had any transactions in this category...</p>
                  ) : (
                    <Pie {...pieChartConfig} />
                  )}
                </Card>
              </Row>
            </>
          )}
          <TransactionSearch
            transactions={transactions}
            exportToCsv={exportToCsv}
            fetchTransactions={fetchTransactions}
            addTransaction={addTransaction}
          />
        </>
      )}
      <footer className="footer">
        <div className="footer-content">
          <h1>Contact Us</h1>
          <div className="social-icons">
            <a href="https://www.instagram.com/dev_bhukya_55/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="mailto:bhukyarahuldev@gmail.com">
              <MdEmail />
            </a>
            <a href="https://x.com/Rahul85767740" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
          <p>
            For more contact info, visit our <Link to="/contact">Contact Page</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
