import './style.css'

import * as THREE from 'three'

//Set size
const sizes = 
{
  width : window.innerWidth,
  height : window.innerHeight
}

//Create scene
const scene = new THREE.Scene();

//Create renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas : canvas})
renderer.setSize(sizes.width,sizes.height);


//Create Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
scene.add(camera);
camera.position.set(0,0,5);

//Create Box Object
const boxGeo = new THREE.BoxGeometry(1,1,1);
const boxMat = new THREE.MeshBasicMaterial({color: 0xFF0000});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);

//Render scene
renderer.render(scene,camera);

//Reset Camera on resize window (Function)
window.addEventListener("resize",() =>
{
  sizes.width = window.innerWidth,
  sizes.height = window.innerHeight

  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(sizes.width,sizes.height);
  renderer.render(scene,camera);
})

//Full screen on double click (Function)
window.addEventListener("dblclick",() =>
{
  if(!document.fullscreenElement)
  {
    canvas.requestFullscreen();
  }
  else
  {
    document.exitFullscreen();
  }
})

//Rotate Box (Function)
const tick = () =>
{
  box.rotation.y += .01;

  renderer.render(scene,camera);
  window.requestAnimationFrame(tick);
}

tick();

