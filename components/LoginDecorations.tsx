import { useState, useEffect } from 'react';

interface LoginDecorationsProps {
  monkeyImages?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
}

const LoginDecorations: React.FC<LoginDecorationsProps> = ({ 
  monkeyImages = {
    topLeft: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20right%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    topRight: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20left%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    bottomLeft: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20right%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    bottomRight: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20left%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square'
  }
}) => {
  const [loginFormSize, setLoginFormSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 监听窗口大小变化
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      // 估计登录表单的大小（基于常见设备尺寸）
      // 实际项目中可以通过ref获取真实大小
      const estimatedFormWidth = Math.min(window.innerWidth * 0.8, 400);
      const estimatedFormHeight = Math.min(window.innerHeight * 0.8, 600);
      setLoginFormSize({
        width: estimatedFormWidth,
        height: estimatedFormHeight
      });
    };

    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* 2D树枝边框 */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 bg-contain bg-repeat-x opacity-80" 
        style={{
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20horizontal%2C%20simple%202D%20style%2C%20brown%20color&image_size=landscape_16_9')`,
          backgroundSize: `${loginFormSize.width}px 64px`
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 bg-contain bg-repeat-x opacity-80" 
        style={{
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20horizontal%2C%20simple%202D%20style%2C%20brown%20color&image_size=landscape_16_9')`,
          backgroundSize: `${loginFormSize.width}px 64px`
        }}
      />
      <div 
        className="absolute top-16 bottom-16 left-0 w-16 bg-contain bg-repeat-y opacity-80" 
        style={{
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20vertical%2C%20simple%202D%20style%2C%20brown%20color&image_size=portrait_16_9')`,
          backgroundSize: `64px ${loginFormSize.height}px`
        }}
      />
      <div 
        className="absolute top-16 bottom-16 right-0 w-16 bg-contain bg-repeat-y opacity-80" 
        style={{
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20vertical%2C%20simple%202D%20style%2C%20brown%20color&image_size=portrait_16_9')`,
          backgroundSize: `64px ${loginFormSize.height}px`
        }}
      />

      {/* 香蕉装饰 */}
      <div className="absolute top-8 left-1/4 opacity-80 animate-bounce" style={{ animationDuration: '3s' }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute top-8 right-1/4 opacity-80 animate-bounce" style={{ animationDuration: '3.5s' }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute bottom-8 left-1/4 opacity-80 animate-bounce" style={{ animationDuration: '4s' }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute bottom-8 right-1/4 opacity-80 animate-bounce" style={{ animationDuration: '4.5s' }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* 猩猩头部模型 */}
      <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
        <img 
          src={monkeyImages.topLeft} 
          alt="Monkey Top Left" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '4s' }}
        />
      </div>
      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
        <img 
          src={monkeyImages.topRight} 
          alt="Monkey Top Right" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '4.5s' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
        <img 
          src={monkeyImages.bottomLeft} 
          alt="Monkey Bottom Left" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '5s' }}
        />
      </div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
        <img 
          src={monkeyImages.bottomRight} 
          alt="Monkey Bottom Right" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '5.5s' }}
        />
      </div>
    </div>
  );
};

export default LoginDecorations;