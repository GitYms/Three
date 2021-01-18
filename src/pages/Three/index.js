import React, { useEffect } from 'react';
import * as THREE from 'three';
import './index.css';

const Three = () => {
  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    // const width = canvas.clientWidth;
    // const height = canvas.clientHeight;

    // 处理HD-DPI（ high-density dot per inch displays）
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  useEffect(() => {
    const main = () => {

      const makeInstance = (geometry, color, x) => {
        const material = new THREE.MeshPhongMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;

        return cube;
      }

      // c创建场景
      const canvas = document.querySelector('#c');
      const renderer = new THREE.WebGLRenderer({canvas});
      // 设置 画布内部尺寸
      // renderer.setSize(window.innerWidth, window.innerHeight);

      const fov = 75;
      const aspect = 2;  // the canvas default
      const near = 0.1;
      const far = 5;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

      camera.position.z = 2;
      const scene = new THREE.Scene();

      const boxWidth = 1;
      const boxHeight = 1;
      const boxDepth = 1;
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
      // 创建材料 并加入到场景中
      // MeshPhongMaterial 会被光源影响   MeshBasicMaterial不会被光源影响
      const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
      // 创建对象（Mesh)
      // const cube = new THREE.Mesh(geometry, material);
      // scene.add(cube);
      // renderer.render(scene, camera);

      // 基础体：cube
      const cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
      ];

      // 旋转
      function render(time) {
        time *= 0.001;  // convert time to seconds

        // cube.rotation.x = time;
        // cube.rotation.y = time;

        cubes.forEach((cube, ndx) => {
          const speed = 1 + ndx * .1;
          const rot = time * speed;
          cube.rotation.x = rot;
          cube.rotation.y = rot;
        });
        // 动态设置 画布内部size
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          console.log( canvas.clientWidth , canvas.clientHeight)
          camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);

      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      // 光源位置：相机左上方
      light.position.set(-1, 2, 4);
      scene.add(light);

    };

    main();

  }, [])

  return (<div className='page'>
    <p>
      sghowngowhgwleghw wehogweognwgj woghowego Nam augue nisi, elementum id diam vel, blandit imperdiet
      nunc.  Vivamus facilisis imperdiet neque id porttitor.  Mauris sapien
      felis, mollis tempus orci vitae, sollicitudin varius augue.  Nullam non
      magna id sem faucibus sollicitudin.  Proin nunc mi, rutrum et elementum
      ut, auctor eget massa. <canvas className='canvas' id='c'></canvas> Nam augue nisi, elementum id diam vel,
      blandit imperdiet nunc.  Vivamus facilisis imperdiet neque id porttitor.  Mauris sapien
      felis, mollis tempus orci vitae, sollicitudin varius augue.  Nullam non
      magna id sem faucibus sollicitudin.  Proin nunc mi, rutrum et elementum
      ut, auctor eget massa.
    </p>

  </div>);
}

export default Three;
