import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Modal, notification, Tabs, Typography } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckedInVisitors from './CheckedInVisitors';
import ExpiredPreApprovals from './ExpiredPreApprovals';
import UpcomingPreApprovals from './UpcomingPreApprovals';

const { TabPane } = Tabs;
const { Title } = Typography;

const SecurityGuardVisitorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

  const handleCheckOut = (arrivalId: number) => {
    console.log('Checking in visitor:', arrivalId);
    // Replace this with your actual check-in logic
    // (e.g., calling an API, updating state)
  };

  return (
    <div className="bg-yt-black text-white min-h-screen p-8">
      {modalContextHolder}
      {contextHolder}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Security Check-in</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-white hover:text-blue-400 p-0"
      >
        Back to Dashboard
      </Button>
      <Title level={2}>Security Check-in</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Upcoming Arrivals" key="1">
          <UpcomingPreApprovals />
        </TabPane>
        <TabPane tab="Expired Arrivals" key="2">
          <ExpiredPreApprovals />
        </TabPane>
        <TabPane tab="Checked In Visitors" key="3">
          <CheckedInVisitors onCheckOut={handleCheckOut} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SecurityGuardVisitorManagement;
