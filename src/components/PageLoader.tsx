import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Spin 
        indicator={
          <LoadingOutlined 
            style={{ 
              fontSize: 48,
              color: '#fff'
            }} 
            spin 
          />
        }
      />
    </div>
  );
};

export default PageLoader; 