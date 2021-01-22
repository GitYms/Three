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
      // 4面体
      addSolidGeometry(2, 2, new THREE.TetrahedronBufferGeometry(7, 0)) // radius, detail
      // 12面体
      addSolidGeometry(-2, 1, new THREE.DodecahedronBufferGeometry(7, 0)) // radius, detail
      // 20面体
      addSolidGeometry(-1, 1, new THREE.IcosahedronBufferGeometry(7, 0)) // radius, detailconst points = [];
      // 8面体
      addSolidGeometry(0, 1, new THREE.OctahedronBufferGeometry(7, 0)) // radius, detail


      // 2d挤压形状
      // 圆环
      const geometry = new THREE.RingBufferGeometry( 2, 7, 9, 9, thetaStart, thetaLength);
      addSolidGeometry(1, 1, geometry);
      // 环形
      addSolidGeometry(2, 1, new THREE.TorusBufferGeometry(6, 3, 15, 5))
      // -心形
      const shape = new THREE.Shape();
      const x1 = -2.5;
      const y1 = -5;
      shape.moveTo(x1 + 2.5, y1 + 2.5);
      shape.bezierCurveTo(x1 + 2.5, y1 + 2.5, x1 + 2, y1, x1, y1);
      shape.bezierCurveTo(x1 - 3, y1, x1 - 3, y1 + 3.5, x1 - 3, y1 + 3.5);
      shape.bezierCurveTo(x1 - 3, y1 + 5.5, x1 - 1.5, y1 + 7.7, x1 + 2.5, y1 + 9.5);
      shape.bezierCurveTo(x1 + 6, y1 + 7.7, x1 + 8, y1 + 4.5, x1 + 8, y1 + 3.5);
      shape.bezierCurveTo(x1 + 8, y1 + 3.5, x1 + 8, y1, x1 + 5, y1);
      shape.bezierCurveTo(x1 + 3.5, y1, x1 + 2.5, y1 + 2.5, x1 + 2.5, y1 + 2.5);
      const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 2,
      };
      addSolidGeometry(-2, 0, new THREE.ExtrudeBufferGeometry(shape, extrudeSettings));

      const outline = new THREE.Shape([
        [ -2, -0.1], [  2, -0.1], [ 2,  0.6],
        [1.6,  0.6], [1.6,  0.1], [-2,  0.1],
      ].map(p => new THREE.Vector2(...p)));
      const x = -2.5;
      const y = -5;
      const shape1 = new THREE.CurvePath();
      const points = [
        [x + 2.5, y + 2.5],
        [x + 2.5, y + 2.5], [x + 2,   y      ], [x,       y      ],
        [x - 3,   y      ], [x - 3,   y + 3.5], [x - 3,   y + 3.5],
        [x - 3,   y + 5.5], [x - 1.5, y + 7.7], [x + 2.5, y + 9.5],
        [x + 6,   y + 7.7], [x + 8,   y + 4.5], [x + 8,   y + 3.5],
        [x + 8,   y + 3.5], [x + 8,   y      ], [x + 5,   y      ],
        [x + 3.5, y      ], [x + 2.5, y + 2.5], [x + 2.5, y + 2.5],
      ].map(p => new THREE.Vector3(...p, 0));
      for (let i = 0; i < points.length; i += 3) {
        shape1.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
      }
      const extrudeSettings1 = {
        steps: 100,
        bevelEnabled: true,
        extrudePath: shape1,
      };
      const geometry1 =  new THREE.ExtrudeBufferGeometry(outline, extrudeSettings1);
      addSolidGeometry(-1, 0, geometry1);
      // 有弧度的圆柱体  酒杯、台灯灯罩等
      const meshPoints = [];
      for (let i = 0; i < 10; ++i) {
        meshPoints.push(new THREE.Vector2(Math.sin(i * 0.3) * 3 + 2, (i - 5) * .8));
      }
      const mesh1 = new THREE.LatheBufferGeometry(meshPoints);
      addSolidGeometry(0, 0, mesh1)

      // 通过点画出的曲线
      function klein(v, u, target) {
        u *= Math.PI;
        v *= 2 * Math.PI;
        u = u * 2;
        let x;
        let z;
        if (u < Math.PI) {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
            z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
        }
        const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
        target.set(x, y, z).multiplyScalar(0.75);
      }
      const slices = 25;
      const stacks = 25;
      addSolidGeometry(1, 0, new THREE.ParametricBufferGeometry(klein, slices, stacks));

      // 小圆画出的路径
      class CustomSinCurve extends THREE.Curve {
        constructor(scale) {
          super();
          this.scale = scale;
        }
        getPoint(t) {
          const tx = t * 3 - 1.5;
          const ty = Math.sin(2 * Math.PI * t);
          const tz = 0;
          return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
      }
      const path = new CustomSinCurve(4);
      const tubularSegments =  42;
      const radialSegments = 21;
      const closed = false;
      addSolidGeometry(2, 0, new THREE.TubeBufferGeometry( path, tubularSegments, 1.5, radialSegments, closed))
      // 2d
      addSolidGeometry(-2, -1, new THREE.PlaneBufferGeometry(7, 7, 5, 5));
      // ??? 一组以点为中心的三角形并将其投影到球体上
      const verticesOfCube = [
        -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
        -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
      ];
      const indicesOfFaces = [
          2, 1, 0,    0, 3, 2,
          0, 4, 7,    7, 3, 0,
          0, 1, 5,    5, 4, 0,
          1, 2, 6,    6, 5, 1,
          2, 3, 7,    7, 6, 2,
          4, 5, 6,    6, 7, 4,
      ];
      addSolidGeometry(-1, -1, new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, 7, 1));
      // 2d 圆环
      addSolidGeometry(0, -1, new THREE.RingBufferGeometry( 2, 5, 8, 4, thetaStart, thetaLength));
      // 2d桃心
      const curveSegments2 = 5;
      addSolidGeometry(1, -1, new THREE.ShapeBufferGeometry(shape, curveSegments2))
      // 球体
      addSolidGeometry(2, -1, new THREE.SphereBufferGeometry(7, 17, 17, Math.PI * 2, Math.PI * 2, Math.PI * 0,  Math.PI * 1))

      const size = 8;
      const widthSegments = 2;
      const heightSegments = 2;
      const depthSegments = 2;
      const boxGeometry = new THREE.BoxBufferGeometry(size, size, size, widthSegments, heightSegments, depthSegments);
      const geometry2 = new THREE.EdgesGeometry(boxGeometry);
      addLineGeometry(-2, -2, geometry2)
      addLineGeometry(-1, -2, new THREE.WireframeGeometry(new THREE.BoxBufferGeometry(8, 8, 8, 7, 7, 7)))

      // 文字
      const loader = new THREE.FontLoader();
      function loadFont(url) {
        return new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
      }
      async function doit() {
        const fontUrl = 'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json';
        const font = await loadFont(fontUrl);
        const geometry = new THREE.TextBufferGeometry('hello three.js', {
          font: font,
          size: 3.0,
          height: .2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: .3,
          bevelSegments: 5,
        });
        const mesh = new THREE.Mesh(geometry, createMaterial());
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

        const parent = new THREE.Object3D();
        parent.add(mesh);

        addObject(1, -2, parent);
      }
      doit();


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
