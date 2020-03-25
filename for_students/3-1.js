/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { onWindowOnload } from "../libs/CS559-Libs/helpers.js";

function threeSimple() {
  let renderer = new T.WebGLRenderer();
  renderer.setSize(200, 200);

  let div = document.getElementById("div1");
  div.appendChild(renderer.domElement);

  let camera = new T.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;

  let scene = new T.Scene();
  let geometry = new T.BoxGeometry(1, 1, 1);
  let mat = new T.MeshStandardMaterial({ color: "green" });
  let cube = new T.Mesh(geometry, mat);
  scene.add(cube);

  let ambientLight = new T.AmbientLight("white", 0.5);
  scene.add(ambientLight);
  let pointLight = new T.PointLight("white", 1);
  pointLight.position.set(25, 50, 25);
  scene.add(pointLight);

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
onWindowOnload(threeSimple);
