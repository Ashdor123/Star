
import { useState, useRef, useEffect } from 'react';

interface EditProfileProps {
  userName: string;
  userAvatar: string;
  onSave: (name: string, avatar: string) => void;
  onBack: () => void;
}

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBKIX2OmDCFAsYZPJakpCWjAx4bV0_jt7FNLY4P8_7hKMzJUv1tvxi26PDFKeags8OXhJir2HiQ24ckz8e12k4UsUVz2LkTHDPVg-dV4RBBeJ-M8omakJOFH8bhXrVY_SLMbcEVeOhds1RaPkoMWf9En6PUTluqAR95XogJfu9dZ_wZikKEW7LnGo6Xc3gIl5h0vWi-8EfDVM0ULaTQOQz2RZUkZAz5Gt5P9An3YyPNel3ni8RiVUHzipK1YWH7K3ZHhm5odFt6WJA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7e5R8u2xiDc6tD6-xtIp7Zx3-ccq4qflGPMavW5bkzSf4mlt0jd4tI_OcGdIqp_uS1KwQrwm4HqfJvD5tV1N91bpeZ54HQmHKXA8sjijCUjUtZr_y9Ai4WOQa5249ULNLT6QLnasyxxJr39rSJ5gMmRMKUChD0xdj2g86gqQmp7Sbj9FReloHvPS-eLN2AyAOHr17cikoXpZ1cmHES8mVLHrLsGXIJ2n95CquLq_Am-RnNq4P8DWcIkmadgLiF3itBSN2diPaPKo',
];

// 上传头像函数
const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  // 传递用户ID，这里可以从登录状态获取
  const userId = localStorage.getItem('userId') || 'guest';
  
  try {
    const response = await fetch(`/api/upload/avatar?userId=${userId}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('上传失败');
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

const EditProfile: React.FC<EditProfileProps> = ({ userName, userAvatar, onSave, onBack }) => {
  const [name, setName] = useState(userName);
  const [avatar, setAvatar] = useState(userAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // 裁剪相关状态
  const [isCropping, setIsCropping] = useState(false);
  const [cropImage, setCropImage] = useState<string>('');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // 引用
  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('只支持图片文件 (JPEG, PNG, GIF, WebP)');
      return;
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('文件大小不能超过 5MB');
      return;
    }

    // 验证图片尺寸
    const imageDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

    const maxWidth = 2000;
    const maxHeight = 2000;
    if (imageDimensions.width > maxWidth || imageDimensions.height > maxHeight) {
      setUploadError(`图片尺寸不能超过 ${maxWidth}x${maxHeight} 像素`);
      return;
    }

    // 进入裁剪模式
    setCropImage(URL.createObjectURL(file));
    setIsCropping(true);
    setUploadError(null);
  };

  // 处理图片拖动
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理图片缩放
  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, imageScale * delta));
    setImageScale(newScale);
  };

  // 执行裁剪并上传
  const handleCrop = async () => {
    if (!cropImage) return;

    setIsUploading(true);

    try {
      // 创建canvas进行裁剪
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }

      // 加载图片并裁剪
      const img = new Image();
      img.src = cropImage;
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // 计算裁剪区域
          const containerWidth = 400; // 裁剪容器宽度
          const containerHeight = 400; // 裁剪容器高度
          const cropSize = 200; // 裁剪框大小
          
          // 计算裁剪框中心位置
          const cropCenterX = containerWidth / 2;
          const cropCenterY = containerHeight / 2;
          
          // 计算裁剪区域相对于图片的位置
          const cropX = (cropCenterX - imagePosition.x - cropSize / 2) / imageScale;
          const cropY = (cropCenterY - imagePosition.y - cropSize / 2) / imageScale;
          const cropWidth = cropSize / imageScale;
          const cropHeight = cropSize / imageScale;

          // 确保裁剪区域在图片范围内
          const safeCropX = Math.max(0, cropX);
          const safeCropY = Math.max(0, cropY);
          const safeCropWidth = Math.min(cropWidth, img.width - safeCropX);
          const safeCropHeight = Math.min(cropHeight, img.height - safeCropY);

          // 绘制裁剪区域到canvas
          ctx.drawImage(img, safeCropX, safeCropY, safeCropWidth, safeCropHeight, 0, 0, 200, 200);
          resolve();
        };
        img.onerror = reject;
      });

      // 将canvas转换为blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });

      if (!blob) {
        throw new Error('无法创建裁剪后的图片');
      }

      // 创建File对象
      const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      // 上传裁剪后的图片
      const imageUrl = await uploadAvatar(croppedFile);
      setAvatar(imageUrl);
      setIsCropping(false);
      setCropImage('');
    } catch (error) {
      setUploadError('裁剪或上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 取消裁剪
  const handleCancelCrop = () => {
    setIsCropping(false);
    setCropImage('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isCropping ? (
        // 裁剪模式
        <div className="flex flex-col min-h-screen bg-white">
          <header className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-50">
            <button 
              onClick={handleCancelCrop}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
            >
              <span className="material-icons-round">close</span>
            </button>
            <h1 className="text-2xl font-black text-gray-800">裁剪头像</h1>
          </header>

          <main className="flex-1 p-6 flex flex-col items-center justify-center">
            {/* 裁剪区域 */}
            <div className="relative w-full max-w-md aspect-square border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
              <div 
                ref={cropContainerRef}
                className="relative w-full h-full overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={cropImage}
                  alt="裁剪预览"
                  className="absolute transition-transform duration-100"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={handleMouseDown}
                  onWheel={handleWheel}
                />
                {/* 裁剪框 */}
                <div 
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white shadow-lg"
                  style={{
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                />
                {/* 操作提示 */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                  拖动图片调整位置，滚轮缩放图片
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="w-full space-y-4">
              <button 
                onClick={handleCrop}
                disabled={isUploading}
                className="w-full bg-primary text-white font-black py-4 rounded-[2rem] shadow-lg active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="material-icons-round animate-spin">refresh</span>
                    <span>上传中...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons-round">crop</span>
                    <span>确认裁剪</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleCancelCrop}
                disabled={isUploading}
                className="w-full bg-gray-200 text-gray-800 font-black py-4 rounded-[2rem] active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">close</span>
                <span>取消</span>
              </button>
            </div>

            {/* 错误提示 */}
            {uploadError && (
              <div className="mt-4 text-center text-sm text-red-500">
                {uploadError}
              </div>
            )}
          </main>
        </div>
      ) : (
        // 正常模式
        <>
          <header className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-50">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
            >
              <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-2xl font-black text-gray-800">个性设置</h1>
          </header>

          <main className="flex-1 p-6 space-y-10 flex flex-col items-center">
            {/* Current Selection Preview */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 bg-white shadow-xl overflow-hidden">
                 <img alt="用户头像" className="w-full h-full rounded-full object-cover" src={avatar} onError={(e) => {
                   console.error('头像加载失败:', e);
                   console.log('头像URL:', avatar);
                 }}/>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                 <span className="material-icons-round text-sm">face</span>
              </div>
            </div>

            {/* Name Input */}
            <div className="w-full space-y-3">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">我的名字</label>
              <div className="relative">
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-lg text-gray-800 focus:ring-4 focus:ring-primary/10 transition-all placeholder-gray-300"
                  placeholder="输入你的名字..."
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-300">edit</span>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="w-full space-y-4">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">选择头像</label>
              <div className="grid grid-cols-2 gap-6">
                {AVATARS.map((src, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setAvatar(src)}
                    className={`aspect-square rounded-[2rem] p-1.5 transition-all transform active:scale-95 ${
                      avatar === src ? 'bg-primary shadow-lg shadow-primary/30 scale-105' : 'bg-gray-100'
                    }`}
                  >
                    <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden">
                       <img alt={`Avatar ${idx}`} className="w-full h-full object-cover" src={src}/>
                    </div>
                  </button>
                ))}
                {/* 自定义上传按钮 */}
                <button 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="aspect-square rounded-[2rem] p-1.5 bg-gray-100 flex items-center justify-center transition-all transform active:scale-95 hover:bg-gray-200"
                >
                  <div className="w-full h-full bg-white rounded-[1.8rem] flex flex-col items-center justify-center p-4 text-gray-400">
                    <span className="material-icons-round text-3xl mb-2">add_photo_alternate</span>
                    <span className="text-xs font-medium">上传头像</span>
                  </div>
                </button>
                {/* 隐藏的文件输入 */}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              {/* 上传状态提示 */}
              {isUploading && (
                <div className="text-center text-sm text-gray-500">
                  上传中...
                </div>
              )}
              {uploadError && (
                <div className="text-center text-sm text-red-500">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="pt-6 w-full">
               <button 
                onClick={() => onSave(name || '星星宝贝', avatar)}
                className="w-full bg-primary text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">check_circle</span>
                <span>确认修改</span>
              </button>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default EditProfile;
