import { Button, Form, Input, message, notification, Typography } from 'antd'; // Import notification
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

const { Title } = Typography;

interface LoginPageProps {}

interface LoginValues {
    mobileNumber: string;
    password: string;
}

const LoginPage: React.FC<LoginPageProps> = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        form.validateFields()
            .then((values) => {
                loginUser(values);
            })
            .catch((errorInfo) => {
                api.error({
                    message: 'Validation Failed',
                    description: 'Please check your input and try again.',
                    duration: 5,
                    placement: 'top'
                });
            });
    };

    const loginUser = async (values: LoginValues) => {
        setIsLoading(true);
        try {
            // First, make the login request
            await axios.post('/users/login', {
                mobile_number: values.mobileNumber,
                password: values.password,
            });

            // Then, update the auth context by calling checkAuth
            await auth.checkAuth();

            message.success('Login successful!');
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            api.error({
                message: 'Login Failed',
                description: error.response?.data?.error || 'Invalid credentials. Please try again.',
                duration: 5,
                placement: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            {isLoading && <PageLoader />}
            <div className="flex justify-center items-center h-screen bg-yt-black">
                <div className="bg-yt-light-gray rounded-lg shadow-xl p-12 w-96 text-white">
                    <Title level={2} className="text-center mb-16 text-white">Sign In</Title>
                    <Form form={form} layout="vertical" onFinish={handleLogin}>
                        <Form.Item
                            label="Mobile Number"
                            name="mobileNumber"
                            rules={[{ required: true, message: 'Please enter your mobile number!' }]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input
                                placeholder="Enter your mobile number"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                            className="mb-8"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                size="large"
                                className="py-2"
                                disabled={isLoading}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full mb-8 h-12"
                            loading={isLoading}
                        >
                            Log In
                        </Button>
                    </Form>
                    <Typography.Link
                        onClick={() => navigate('/register')}
                        className="block text-center mb-4 text-blue-400"
                    >
                        Don't have an account? Register
                    </Typography.Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;