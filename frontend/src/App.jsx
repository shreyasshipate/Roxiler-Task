import { Layout, Menu, Select } from "antd";
import React, { useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Stats from "./components/Stats";
import Transactions from "./components/Transactions";

const { Header, Content, Footer } = Layout;

const navItems = [
  {
    key: 1,
    label: <NavLink to="/stats">Stats</NavLink>,
  },
  {
    key: 2,
    label: <NavLink to="/transact">Transactions</NavLink>,
  },
];

const options = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function App() {
  let [month, setMonth] = useState(3);

  const handleMonthChange = (value) => {
    setMonth(parseInt(value));
  };

  const location = useLocation();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <h1 style={{ color: "white", paddingRight: "40px" }}>Home</h1>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={navItems}
          style={{
            flex: 1,
            padding: "30 60px",
            paddingRight: "20px",
            paddingLeft: "20px",
            display: "flex",
            flexFlow: "row-reverse",
          }}
        />
      </Header>

      <Content
        style={{
          padding: "10px 48px",
          backgroundColor: "white",
          minHeight: 600,
          paddingLeft: "40px",
        }}
      >
        {location.pathname === "/transact" && (
          <Select
            size="large"
            defaultValue={options[month]}
            onChange={handleMonthChange}
            style={{
              width: 200,
              display: "flex",
              justifySelf: "flex-end",
              justifyContent: "flex-end",
            }}
            options={options.map((text, i) => {
              return {
                value: i,
                label: text,
              };
            })}
          />
        )}

        <Routes>
          <Route
            path="/transact"
            element={<Transactions month={month} monthText={options[month]} />}
          />
          <Route
            path="/stats"
            element={<Stats month={month} monthText={options[month]} />}
          />
        </Routes>
      </Content>

      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Developed by <strong>Shreyas</strong>
      </Footer>
    </Layout>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
