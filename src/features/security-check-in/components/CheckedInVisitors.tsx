import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Space, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useLoading } from '../../../context/LoadingContext';
import { API_ENDPOINTS } from '../../../constants';

const { Title } = Typography;

interface CheckedInVisitor {
  id: number;
  pre_approval_id: number;
  visitor_name: string;
  arrival_time: string;
  apartment_number: string;
  security_guard_checkin: string;
  security_guard_checkout: string;
  created_at: string;
}

const CheckedInVisitors: React.FC<{ onCheckOut: (arrivalId: number) => void }> = ({ onCheckOut }) => {
  const { startLoading, stopLoading } = useLoading();
  const [checkedInVisitors, setCheckedInVisitors] = useState<CheckedInVisitor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCheckedIn = async () => {
    startLoading();
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/visitor-pre-approvals/arrivals/paginated`, {
        params: {
          page: currentPage,
          limit: pageSize,
        },
      }); // Adjust URL
      setCheckedInVisitors(response.data.data);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching checked-in visitors:', error);
      message.error('Failed to fetch checked-in visitors.');
    } finally {
      stopLoading();
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    fetchCheckedIn();
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Visitor Name',
      dataIndex: 'visitor_name',
      key: 'visitor_name',
    },
    {
      title: 'Arrival Time',
      dataIndex: 'arrival_time',
      key: 'arrival_time',
      render: (text: string) => dayjs(text).format('h:mm A'),
    },
    {
      title: 'Apartment',
      dataIndex: 'apartment_number',
      key: 'apartment_number',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Button type="primary" size="small" onClick={() => onCheckOut(record.id)}>
          Check Out
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Currently Checked In</Title>
      <Table
        dataSource={checkedInVisitors}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange:(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CheckedInVisitors;
