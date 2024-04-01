import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui';


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
camera.position.set(0,3,9);

//Camera orbit helper
const orbit = new OrbitControls(camera,renderer.domElement);
orbit.update();

//Axis Helper
const axesHelper =  new THREE.AxesHelper(3);
scene.add(axesHelper);

//Creating things
const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshLambertMaterial({color: 0x008000, side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo,planeMat);
scene.add(plane);
plane.rotation.x= -.5* Math.PI;

const gridHelper = new THREE.GridHelper(30,60);
scene.add(gridHelper);

const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);
box.position.set(0,0,0);

const sphereGeo = new THREE.SphereGeometry(1,50,50);
const sphereMat = new THREE.MeshLambertMaterial({color: 0x00ff00 , wireframe : false});
const sphere = new THREE.Mesh(sphereGeo,sphereMat);
scene.add(sphere);
sphere.position.set(2,2,2);


// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1).normalize(); // Set position
scene.add(directionalLight);

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

const gui =  new dat.GUI();

const options = {
    boxColor : '#ffea00',
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01
};

gui.addColor(options,'sphereColor').onChange(function (e)
{
    sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function (e)
{
    sphere.material.wireframe = e;
});

gui.addColor(options,'boxColor').onChange(function (e)
{
    box.material.color.set(e);
});
gui.add(options,'speed',0,.1);

let step =0;

//Rotate Box (Function)
const tick = () =>
{
  step+=options.speed;
  box.rotation.y += .01;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  renderer.render(scene,camera);
  window.requestAnimationFrame(tick);
}

tick();


