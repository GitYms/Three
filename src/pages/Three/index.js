import React, { useEffect } from 'react';
import * as THREE from 'three';
// import './index.css';

const Three = () => {

  // const makeInstance = (geometry, color, x) => {
  //   const material = new THREE.MeshPhongMaterial({color});

  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);

  //   cube.position.x = x;

  //   return cube;
  // }

  useEffect(() => {
    const main = () => {
      // c创建场景
      const canvas = document.querySelector('#c');
      const renderer = new THREE.WebGLRenderer({canvas});
      renderer.setSize(window.innerWidth, window.innerHeight);

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
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      renderer.render(scene, camera);
      // 旋转
      function render(time) {
        time *= 0.001;  // convert time to seconds

        cube.rotation.x = time;
        cube.rotation.y = time;

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

  return (<div>
    <canvas id='c'></canvas>
  </div>);
}

export default Three;
