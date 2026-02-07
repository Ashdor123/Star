
import React, { useState } from 'react';

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

const EditProfile: React.FC<EditProfileProps> = ({ userName, userAvatar, onSave, onBack }) => {
  const [name, setName] = useState(userName);
  const [avatar, setAvatar] = useState(userAvatar);

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
             <img alt="Selection" className="w-full h-full rounded-full object-cover" src={avatar}/>
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
          </div>
        </div>

        <div className="pt-6 w-full">
           <button 
            onClick={() => onSave(name || '星星宝贝', avatar)}
            className="w-full bg-primary text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
          >
            <span className="material-icons-round">check_circle</span>
            保存设置
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
