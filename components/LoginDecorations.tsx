import { useState, useEffect, useRef } from 'react';

interface LoginDecorationsProps {
  monkeyImages?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  formRef?: React.RefObject<HTMLDivElement>;
}

const LoginDecorations: React.FC<LoginDecorationsProps> = ({ 
  monkeyImages = {
    topLeft: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20right%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    topRight: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20left%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    bottomLeft: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20right%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square',
    bottomRight: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20head%20facing%20left%2C%20simple%20style%2C%20black%20and%20white%2C%20big%20eyes&image_size=square'
  },
  formRef
}) => {
  const [loginFormSize, setLoginFormSize] = useState({ width: 0, height: 0 });
  const [loginFormPosition, setLoginFormPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 监听窗口大小变化
    const handleResize = () => {
      if (formRef && formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        setLoginFormSize({
          width: rect.width,
          height: rect.height
        });
        setLoginFormPosition({
          x: rect.left,
          y: rect.top
        });
      } else {
        // 估计登录表单的大小（基于常见设备尺寸）
        const estimatedFormWidth = Math.min(window.innerWidth * 0.8, 400);
        const estimatedFormHeight = Math.min(window.innerHeight * 0.8, 600);
        setLoginFormSize({
          width: estimatedFormWidth,
          height: estimatedFormHeight
        });
        setLoginFormPosition({
          x: (window.innerWidth - estimatedFormWidth) / 2,
          y: (window.innerHeight - estimatedFormHeight) / 2
        });
      }
    };

    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);

    // 监听表单元素变化
    const observer = new MutationObserver(handleResize);
    if (formRef && formRef.current) {
      observer.observe(formRef.current, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [formRef]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* 2D树枝边框 - 与登录框尺寸一致 */}
      <div 
        className="absolute bg-contain bg-repeat-x opacity-80" 
        style={{
          top: loginFormPosition.y - 64,
          left: loginFormPosition.x,
          width: loginFormSize.width,
          height: 64,
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20horizontal%2C%20simple%202D%20style%2C%20brown%20color&image_size=landscape_16_9')`,
          backgroundSize: `${loginFormSize.width}px 64px`
        }}
      />
      <div 
        className="absolute bg-contain bg-repeat-x opacity-80" 
        style={{
          top: loginFormPosition.y + loginFormSize.height,
          left: loginFormPosition.x,
          width: loginFormSize.width,
          height: 64,
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20horizontal%2C%20simple%202D%20style%2C%20brown%20color&image_size=landscape_16_9')`,
          backgroundSize: `${loginFormSize.width}px 64px`
        }}
      />
      <div 
        className="absolute bg-contain bg-repeat-y opacity-80" 
        style={{
          top: loginFormPosition.y,
          left: loginFormPosition.x - 64,
          width: 64,
          height: loginFormSize.height,
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20vertical%2C%20simple%202D%20style%2C%20brown%20color&image_size=portrait_16_9')`,
          backgroundSize: `64px ${loginFormSize.height}px`
        }}
      />
      <div 
        className="absolute bg-contain bg-repeat-y opacity-80" 
        style={{
          top: loginFormPosition.y,
          left: loginFormPosition.x + loginFormSize.width,
          width: 64,
          height: loginFormSize.height,
          backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20tree%20branch%20vertical%2C%20simple%202D%20style%2C%20brown%20color&image_size=portrait_16_9')`,
          backgroundSize: `64px ${loginFormSize.height}px`
        }}
      />

      {/* 香蕉装饰 */}
      <div className="absolute opacity-80 animate-bounce" style={{ 
        top: loginFormPosition.y - 40, 
        left: loginFormPosition.x + loginFormSize.width / 4, 
        animationDuration: '3s' 
      }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute opacity-80 animate-bounce" style={{ 
        top: loginFormPosition.y - 40, 
        left: loginFormPosition.x + loginFormSize.width * 3 / 4, 
        animationDuration: '3.5s' 
      }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute opacity-80 animate-bounce" style={{ 
        top: loginFormPosition.y + loginFormSize.height + 8, 
        left: loginFormPosition.x + loginFormSize.width / 4, 
        animationDuration: '4s' 
      }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="absolute opacity-80 animate-bounce" style={{ 
        top: loginFormPosition.y + loginFormSize.height + 8, 
        left: loginFormPosition.x + loginFormSize.width * 3 / 4, 
        animationDuration: '4.5s' 
      }}>
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20banana%2C%20simple%202D%20style%2C%20yellow%20color&image_size=square" 
          alt="Banana" 
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* 熊猫头部模型 */}
      <div className="absolute" style={{ 
        top: loginFormPosition.y - 64, 
        left: loginFormPosition.x - 64 
      }}>
        <img 
          src={monkeyImages.topLeft} 
          alt="Panda Top Left" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '4s' }}
        />
      </div>
      <div className="absolute" style={{ 
        top: loginFormPosition.y - 64, 
        left: loginFormPosition.x + loginFormSize.width - 64 
      }}>
        <img 
          src={monkeyImages.topRight} 
          alt="Panda Top Right" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '4.5s' }}
        />
      </div>
      <div className="absolute" style={{ 
        top: loginFormPosition.y + loginFormSize.height - 64, 
        left: loginFormPosition.x - 64 
      }}>
        <img 
          src={monkeyImages.bottomLeft} 
          alt="Panda Bottom Left" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '5s' }}
        />
      </div>
      <div className="absolute" style={{ 
        top: loginFormPosition.y + loginFormSize.height - 64, 
        left: loginFormPosition.x + loginFormSize.width - 64 
      }}>
        <img 
          src={monkeyImages.bottomRight} 
          alt="Panda Bottom Right" 
          className="w-32 h-32 object-contain animate-pulse" 
          style={{ animationDuration: '5.5s' }}
        />
      </div>
    </div>
  );
};

export default LoginDecorations;