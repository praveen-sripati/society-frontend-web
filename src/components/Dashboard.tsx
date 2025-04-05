import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Notice Board',
            description: 'View and manage society notices',
            route: '/notice-board',
            icon: '📋'
        },
        {
            title: 'Maintenance',
            description: 'Track and submit maintenance requests',
            route: '/maintenance',
            icon: '🔧'
        },
        {
            title: 'Community Chat',
            description: 'Connect with society members',
            route: '/chat',
            icon: '💬'
        },
        {
            title: 'Payments',
            description: 'View and pay maintenance bills',
            route: '/payments',
            icon: '💰'
        }
    ];

    return (
        <div className="p-6">
            <Title level={2} className="mb-6 text-white">Dashboard</Title>
            <Row gutter={[16, 16]}>
                {features.map((feature, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            className="bg-yt-light-gray text-white h-full"
                            onClick={() => navigate(feature.route)}
                        >
                            <div className="text-center mb-4">
                                <span className="text-4xl">{feature.icon}</span>
                            </div>
                            <Title level={4} className="text-white mb-2">
                                {feature.title}
                            </Title>
                            <p className="text-gray-400">
                                {feature.description}
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Dashboard; 