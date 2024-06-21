import { Form, Image, Input, message, Radio, Switch, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

const { Search } = Input;

//Implemented Table using Ant Design
const columns = [
  {
    title: "ind",
    dataIndex: "id",
    width: "40px",
  },
  {
    title: "Title",
    dataIndex: "title",
    width: "200px",
  },
  {
    title: "Price",
    dataIndex: "price",
    render: (price) => parseFloat(price).toFixed(2),
    width: "80px",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Category",
    dataIndex: "category",
    width: "120px",
  },
  {
    title: "Sold",
    dataIndex: "sold",
    render: (sold) => (sold ? "Yes" : "No"),
    width: "50px",
  },
  {
    title: "Date",
    dataIndex: "dateOfSale",
    render: (date) => moment(date).format("DD MMM YYYY"),
    width: "100px",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (url) => <Image src={url} alt="Product Image" />,
    width: "80px",
  },
];

function Transactions({ month, monthText }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [state, setState] = useState({
    bordered: false,
    loading: false,
    size: "default",
    expandedRowRender: undefined,
    title: undefined,
    showHeader: true,
    footer: undefined,
    rowSelection: undefined,
    scroll: undefined,
    hasData: true,
    ellipsis: false,
    tableLayout: undefined,
    pagination: { position: "bottom" },
  });

  //Fetching data from backend api
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/transactions`, {
        params: {
          month,
          page: tableParams.pagination.current,
          limit: tableParams.pagination.pageSize,
          search: tableParams.search,
        },
      });

      setData(data.transactions);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.totalCount,
        },
      });
      message.success("Data shown successfully....");
    } catch (error) {
      console.log(error);
      message.error("Error loading data");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      pagination,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleSearch = (value) => {
    setTableParams({
      ...tableParams,
      search: value,
    });
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams), month]);

  const handleToggle = (prop) => (enable) => {
    setState({ ...state, [prop]: enable });
  };

  const handleSizeChange = (e) => {
    setState({ ...state, size: e.target.value });
  };

  const handleTableLayoutChange = (e) => {
    setState({ ...state, tableLayout: e.target.value });
  };

  const handleExpandChange = (enable) => {
    setState({
      ...state,
      expandedRowRender: enable ? expandedRowRender : undefined,
    });
  };

  const handleEllipsisChange = (enable) => {
    setState({ ...state, ellipsis: enable });
  };

  const handleTitleChange = (enable) => {
    setState({ ...state, title: enable ? title : undefined });
  };

  const handleHeaderChange = (enable) => {
    setState({ ...state, showHeader: enable ? true : false });
  };

  const handleFooterChange = (enable) => {
    setState({ ...state, footer: enable ? footer : undefined });
  };

  const handleRowSelectionChange = (enable) => {
    setState({ ...state, rowSelection: enable ? {} : undefined });
  };

  const handleScollChange = (enable) => {
    setState({ ...state, scroll: enable ? scroll : undefined });
  };

  const handleDataChange = (hasData) => {
    setState({ ...state, hasData });
  };

  const handlePaginationChange = (e) => {
    const { value } = e.target;
    setState({
      ...state,
      pagination: value === "none" ? false : { position: value },
    });
  };

  const expandedRowRender = (record) => <p>{record.description}</p>;
  const title = () => "Here is title";
  const footer = () => "Here is footer";
  const scroll = { y: 480 };

  return (
    <>
      <Search
        placeholder="Search"
        allowClear
        onSearch={handleSearch}
        style={{
          width: 300,
          padding: "12px 0px",
        }}
      />

      <Form
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="Bordered">
          <Switch
            checked={state.bordered}
            onChange={handleToggle("bordered")}
          />
        </Form.Item>
        <Form.Item label="Loading">
          <Switch checked={state.loading} onChange={handleToggle("loading")} />
        </Form.Item>
        <Form.Item label="Title">
          <Switch checked={!!state.title} onChange={handleTitleChange} />
        </Form.Item>
        <Form.Item label="Column Header">
          <Switch checked={!!state.showHeader} onChange={handleHeaderChange} />
        </Form.Item>
        <Form.Item label="Footer">
          <Switch checked={!!state.footer} onChange={handleFooterChange} />
        </Form.Item>
        <Form.Item label="Expandable">
          <Switch
            checked={!!state.expandedRowRender}
            onChange={handleExpandChange}
          />
        </Form.Item>
        <Form.Item label="Checkbox">
          <Switch
            checked={!!state.rowSelection}
            onChange={handleRowSelectionChange}
          />
        </Form.Item>
        <Form.Item label="Fixed Header">
          <Switch checked={!!state.scroll} onChange={handleScollChange} />
        </Form.Item>
        <Form.Item label="Has Data">
          <Switch checked={!!state.hasData} onChange={handleDataChange} />
        </Form.Item>
        <Form.Item label="Ellipsis">
          <Switch checked={!!state.ellipsis} onChange={handleEllipsisChange} />
        </Form.Item>
        <Form.Item label="Size">
          <Radio.Group value={state.size} onChange={handleSizeChange}>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="middle">Middle</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Table Layout">
          <Radio.Group
            value={state.tableLayout}
            onChange={handleTableLayoutChange}
          >
            <Radio.Button value={undefined}>Unset</Radio.Button>
            <Radio.Button value="fixed">Fixed</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Pagination">
          <Radio.Group
            value={state.pagination ? state.pagination.position : "none"}
            onChange={handlePaginationChange}
          >
            <Radio.Button value="top">Top</Radio.Button>
            <Radio.Button value="bottom">Bottom</Radio.Button>
            <Radio.Button value="both">Both</Radio.Button>
            <Radio.Button value="none">None</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>

      <Table
        columns={columns.map((item) => ({ ...item, ellipsis: state.ellipsis }))}
        rowKey={(record) => record.id}
        dataSource={state.hasData ? data : null}
        pagination={state.pagination}
        loading={state.loading}
        onChange={handleTableChange}
        size={state.size}
        bordered={state.bordered}
        title={state.title}
        showHeader={state.showHeader}
        footer={state.footer}
        expandedRowRender={state.expandedRowRender}
        rowSelection={state.rowSelection}
        scroll={state.scroll}
      />
    </>
  );
}

export default Transactions;
