import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, Dropdown, Menu } from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // New state for sort order
  const [payment, setPaymentMethod] = useState(""); // New state for payment method
  const [showSortOrderButtons, setShowSortOrderButtons] = useState(false); // New state for visibility of sort order buttons
  const fileInput = useRef();

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
              date: moment(transaction.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
            };
            await addTransaction(newTransaction, true);
          }
          toast.success("All Transactions Added");
          fetchTransactions();
          event.target.value = null;
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Payment Method", // Add Payment Method column
      dataIndex: "payment",
      key: "payment",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;
    const paymentMatch = payment ? transaction.payment === payment : true; // Corrected payment method filter

    return searchMatch && tagMatch && typeMatch && paymentMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortKey === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortKey === "payment") {
      const aPayment = a.payment || ""; // Provide default value to avoid undefined
      const bPayment = b.payment || ""; // Provide default value to avoid undefined
      return sortOrder === "asc"
        ? aPayment.localeCompare(bPayment)
        : bPayment.localeCompare(aPayment);
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  const handleSortKeyChange = (e) => {
    setSortKey(e.target.value);
    setShowSortOrderButtons(true);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setShowSortOrderButtons(false); // Hide buttons after selection
  };

  const handlePaymentMethodChange = ({ key }) => {
    setPaymentMethod(key);
  };

  const paymentMethodMenu = (
    <Menu onClick={handlePaymentMethodChange}>
      <Menu.Item key="gpay">G-Pay</Menu.Item>
      <Menu.Item key="phonepay">Phone-Pay</Menu.Item>
      <Menu.Item key="paytm">Paytm</Menu.Item>
      <Menu.Item key="cash">Cash</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div className="input-flex">
            <img src={search} width="16" alt="" />
            <input
              placeholder="Search by Name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            className="select-input"
            onChange={(value) => setTypeFilter(value)}
            value={typeFilter}
            placeholder="Filter"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
          <Dropdown overlay={paymentMethodMenu}>
            <Select
              className="select-input"
              value={payment}
              placeholder="Select Payment Method"
              allowClear
            >
              <Option value="gpay">G-Pay</Option>
              <Option value="phonepay">Phone-Pay</Option>
              <Option value="paytm">Paytm</Option>
              <Option value="cash">Cash</Option>
            </Select>
          </Dropdown>
        </div>

        <div className="my-table">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <h2>My Transactions</h2>

            <div
              onMouseEnter={() => setShowSortOrderButtons(true)}
              onMouseLeave={() => setShowSortOrderButtons(false)}
              style={{ position: "relative" }}
            >
              <Radio.Group
                className="input-radio"
                onChange={handleSortKeyChange}
                value={sortKey}
              >
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort by Date</Radio.Button>
                <Radio.Button value="amount">Sort by Amount</Radio.Button>
                <Radio.Button value="payment">Payment Method</Radio.Button>
              </Radio.Group>
              {showSortOrderButtons && sortKey && (
                <Radio.Group
                  className="input-radio"
                  onChange={handleSortOrderChange}
                  value={sortOrder}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 70,
                    background: "#fff",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Radio.Button value="asc">Ascending</Radio.Button>
                  <Radio.Button value="desc">Descending</Radio.Button>
                </Radio.Group>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                width: "400px",
              }}
            >
              <button className="btn" onClick={exportToCsv}>
                Export to CSV
              </button>
              <label htmlFor="file-csv" className="btn btn-blue">
                Import from CSV
              </label>
              <input
                onChange={importFromCsv}
                id="file-csv"
                type="file"
                accept=".csv"
                required
                style={{ display: "none" }}
              />
            </div>
          </div>

          <Table columns={columns} dataSource={dataSource} />
        </div>
      </div>
    </div>
  );
};

export default TransactionSearch;
