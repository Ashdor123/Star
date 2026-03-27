import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LoginDecorations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 创建光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 创建猩猩模型（使用简单的几何体代替实际模型）
    const createMonkey = (position: THREE.Vector3, rotation: THREE.Euler) => {
      // 身体
      const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.copy(position);
      body.rotation.copy(rotation);
      scene.add(body);

      // 头部
      const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.copy(position);
      head.position.y += 1.2;
      head.rotation.copy(rotation);
      scene.add(head);

      // 眼睛
      const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.copy(position);
      leftEye.position.y += 1.3;
      leftEye.position.x += 0.2;
      leftEye.rotation.copy(rotation);
      scene.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.copy(position);
      rightEye.position.y += 1.3;
      rightEye.position.x -= 0.2;
      rightEye.rotation.copy(rotation);
      scene.add(rightEye);

      // 鼻子
      const noseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.copy(position);
      nose.position.y += 1.1;
      nose.rotation.copy(rotation);
      scene.add(nose);

      return body;
    };

    // 创建香蕉模型
    const createBanana = (position: THREE.Vector3, rotation: THREE.Euler) => {
      const bananaGeometry = new THREE.CylinderGeometry(0.1, 0.2, 0.8, 32);
      const bananaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
      const banana = new THREE.Mesh(bananaGeometry, bananaMaterial);
      banana.position.copy(position);
      banana.rotation.copy(rotation);
      scene.add(banana);
      return banana;
    };

    // 创建树枝模型
    const createBranch = (position: THREE.Vector3, rotation: THREE.Euler, length: number) => {
      const branchGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 32);
      const branchMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      branch.position.copy(position);
      branch.rotation.copy(rotation);
      scene.add(branch);
      return branch;
    };

    // 放置猩猩模型
    const monkeys = [
      // 左上
      createMonkey(
        new THREE.Vector3(-3, 2, 0),
        new THREE.Euler(0, Math.PI / 2, 0)
      ),
      // 右上
      createMonkey(
        new THREE.Vector3(3, 2, 0),
        new THREE.Euler(0, -Math.PI / 2, 0)
      ),
      // 左下
      createMonkey(
        new THREE.Vector3(-3, -2, 0),
        new THREE.Euler(0, Math.PI / 2, 0)
      ),
      // 右下
      createMonkey(
        new THREE.Vector3(3, -2, 0),
        new THREE.Euler(0, -Math.PI / 2, 0)
      )
    ];

    // 放置树枝和香蕉
    const decorations = [
      // 顶部树枝
      createBranch(
        new THREE.Vector3(0, 3, 0),
        new THREE.Euler(0, 0, Math.PI / 2),
        6
      ),
      // 底部树枝
      createBranch(
        new THREE.Vector3(0, -3, 0),
        new THREE.Euler(0, 0, Math.PI / 2),
        6
      ),
      // 左侧树枝
      createBranch(
        new THREE.Vector3(-3, 0, 0),
        new THREE.Euler(0, 0, 0),
        4
      ),
      // 右侧树枝
      createBranch(
        new THREE.Vector3(3, 0, 0),
        new THREE.Euler(0, 0, 0),
        4
      ),
      // 香蕉
      createBanana(
        new THREE.Vector3(0, 2.5, 0),
        new THREE.Euler(0, Math.PI / 4, 0)
      ),
      createBanana(
        new THREE.Vector3(0, -2.5, 0),
        new THREE.Euler(0, -Math.PI / 4, 0)
      ),
      createBanana(
        new THREE.Vector3(-2.5, 0, 0),
        new THREE.Euler(0, 0, Math.PI / 4)
      ),
      createBanana(
        new THREE.Vector3(2.5, 0, 0),
        new THREE.Euler(0, 0, -Math.PI / 4)
      )
    ];

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      // 使猩猩模型轻微旋转
      monkeys.forEach((monkey, index) => {
        monkey.rotation.y += 0.005 * (index % 2 === 0 ? 1 : -1);
      });

      // 使香蕉轻微旋转
      decorations.slice(4).forEach((banana, index) => {
        banana.rotation.y += 0.01;
        banana.rotation.x += 0.005;
      });

      renderer.render(scene, camera);
    };

    // 响应式调整
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      // 清理几何体和材质
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default LoginDecorations;