import React, { useEffect } from 'react';
import * as THREE from 'three';
import './index.css';

// https://threejsfundamentals.org/threejs/lessons/threejs-primitives.html


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
      // c创建场景
      const canvas = document.querySelector('#c');
      const renderer = new THREE.WebGLRenderer({ canvas });

      const fov = 40;
      const aspect = 2;  // the canvas default
      const near = 0.1;
      const far = 1000;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 120;


      // 设置背景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xAAAAAA);

      // add light
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);  // 右上方
      scene.add(light);

      // 光源位置：相机左上方
      const light1 = new THREE.DirectionalLight('0xFFFFFF', 1);
      light1.position.set(1, -2, -4);
      scene.add(light1);


      const objects = [];
      const spread = 15;

      // 向场景中添加 材料对象
      const addObject = (x, y, obj) => {
        obj.position.x = x * spread;
        obj.position.y = y * spread;

        scene.add(obj);
        objects.push(obj);
      }

      // 新建材料
      const createMaterial = () => {
        const material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;
        material.color.setHSL(hue, saturation, luminance); // 随机向材料赋色

        return material;
      }

      const addSolidGeometry = (x, y, geometry) => {
        const mesh = new THREE.Mesh(geometry, createMaterial());
        addObject(x, y, mesh);
      }

      const addLineGeometry = (x, y, geometry) => {
        const material = new THREE.LineBasicMaterial({color: 0x000000});
        const mesh = new THREE.LineSegments(geometry, material);
        addObject(x, y, mesh);
      }

      // 盒子（立方体）
      addSolidGeometry(-2, 2, new THREE.BoxBufferGeometry(8, 8, 8, 4, 4, 6)); // width, height, deep, wSegments,hSegments, dSegments
      // 扁圆
      const thetaStart = Math.PI * 0.05;
      const thetaLength = Math.PI * 1.5;
      addSolidGeometry(-1, 2, new THREE.CircleBufferGeometry(7, 24, thetaStart, thetaLength)); // radius, segments
      // 椎体
      addSolidGeometry(0, 2, new THREE.ConeBufferGeometry(6, 10, 16, 10, 10, true, Math.PI * 2,  Math.PI * 2 )); // radius, height, segments
      // 圆柱                                       // radiusTop, radiusBottom, height, radialSegments
      addSolidGeometry(1, 2, new THREE.CylinderBufferGeometry(5, 5, 8, 5))
      // 12面体
      addSolidGeometry(-2, 1, new THREE.DodecahedronBufferGeometry(8, 0)) // radius, detail

      // 2d挤压形状
      const shape = new THREE.Shape();
      const x = -2.5;
      const y = -5;
      shape.moveTo(x + 2.5, y + 2.5);
      shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
      shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
      shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
      shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
      shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
      shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
      const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 2,
      };
      // const geometry = THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

      // addLineGeometry(-1, 1, shape);

      function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        objects.forEach((obj, ndx) => {
          const speed = .1 + ndx * .05;
          const rot = time * speed;
          obj.rotation.x = rot;
          obj.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);

    };

    main();

  }, [])

  return (<div className='primitivesPage'>
    <h1 style={{ textAlign: 'center' }}>不同的基本体</h1>
    <canvas className='pCanvas' id='c'></canvas>
  </div>);
}

export default Three;
