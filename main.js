import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { setSkySphere } from './SkysphereHelper';

// Instantiate the GLTFLoader
const loader = new GLTFLoader();

//Set size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Create scene
const scene = new THREE.Scene();

//Create renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height);
//adding shadow
renderer.shadowMap.enabled = true;

//Create Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
camera.position.set(0, 3, 9);

//Camera orbit helper
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const imagePath = '/HDRISky/puresky4k.hdr';
setSkySphere(scene, imagePath);


// Render scene function
function render() {
    renderer.render(scene, camera);
}

//Axis Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

//Creating things
const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x615959, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);
plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;
plane.position.set(0,-.2,0);

const gridHelper = new THREE.GridHelper(30, 20);
const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    opacity: 0.8,
    transparent: true
});
gridHelper.material = material;
scene.add(gridHelper);

const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshStandardMaterial({ color: 0xedb809 });
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);
box.position.set(-7, 2, -5);
box.castShadow = true;

const sphereGeo = new THREE.SphereGeometry(1, 50, 50);
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x9d0c0c, wireframe: false });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);
sphere.position.set(7, 2, -5);
sphere.castShadow = true;

ModelLoader("Models/shiba/shiba.gltf",-10,1,3,true,false);
ModelLoader("Models/toon_cat/toonCat.gltf",-6,0,2.5,true,true,.004,.004,.004);
ModelLoader("Models/knight_cat/knightCat.gltf",-1,.5,3,true,false,2,.5,2.5);
ModelLoader("Models/char1/char1.gltf",4,0,2.5,false,true,.03,.03,.03);
ModelLoader("Models/char2/char2.gltf",10,0,2.5,false,true,2.5,2.5,2.5);

function ModelLoader(modelPath,x,y,z,canToon,shouldScale,sx,sy,sz) {
  const modelName = extractModelName(modelPath);

  loader.load(
      modelPath,
      function (gltf) {
          scene.add(gltf.scene);
          addObjectControls(gui, gltf.scene, modelName, options);
          // Call function to position the loaded model
          positionLoadedModel(gltf.scene, x, y, z);
          if(shouldScale)
          {
            scaleLoadedModel(gltf.scene,sx,sy,sz);
          }
          // Call function to change material to toon
          if(canToon)
          {
            changeMaterialToToon(gltf.scene);
          }
          
          // Enable shadow casting for the loaded model
          enableShadowCasting(gltf.scene);
      },
      function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
          console.log("An error happened");
      }
  );
}

function extractModelName(modelPath) {
  const start = modelPath.indexOf("Models/") + "Models/".length;
  const end = modelPath.lastIndexOf("/");
  const modelName = modelPath.substring(start, end);
  return modelName;
}

// Function to handle positioning of the loaded model
function positionLoadedModel(model, x, y, z) {
    if (model) {
        // Change the position of the loaded model
        model.position.set(x, y, z); // Set the desired position
    } else {
        console.log("Model not loaded yet.");
    }
}

// Function to handle scaling of the loaded model
function scaleLoadedModel(model, scaleX, scaleY, scaleZ) {
  if (model) {
      // Scale the loaded model
      model.scale.set(scaleX, scaleY, scaleZ); // Set the desired scale
  } else {
      console.log("Model not loaded yet.");
  }
}

// Function to handle changing material to toon
function changeMaterialToToon(model) {
    if (model) {
        // Traverse through all the meshes in the loaded model
        model.traverse(function (child) {
            if (child.isMesh) {
                // Create a toon material
                const toonMaterial = new THREE.MeshToonMaterial({
                    color: child.material.color, // You can set the color based on the original material
                    // Copy over texture map if it exists
                    map: child.material.map,
                });

                // Replace the existing material with the toon material
                child.material = toonMaterial;
            }
        });
    } else {
        console.log("Model not loaded yet.");
    }
}

// Function to handle enabling shadow casting for the loaded model
function enableShadowCasting(model) {
    if (model) {
        model.traverse(function (child) {
            if (child.isMesh) {
                // Enable shadow casting for each mesh
                child.castShadow = true;
            }
        });
    } else {
        console.log("Model not loaded yet.");
    }
}

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1).normalize(); // Set position
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 30, 0);
directionalLight.shadow.camera.bottom = -12;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;

//Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff,3);
scene.add(ambientLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

//Reset Camera on resize window (Function)
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth,
        sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    render();
});

//Full screen on double click (Function)
window.addEventListener("dblclick", () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

const gui = new dat.GUI();

const options = {
    speed: 0.01
};

function addObjectControls(gui, object, name) {
    const options = {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        color: '#ffffff',
        wireframe: false
    };

    const folderControls = gui.addFolder(`${name} Controls`);
    folderControls.add(options, 'positionX', -50, 50).onChange(function (value) {
        object.position.x = value;
    });
    folderControls.add(options, 'positionY', -50, 50).onChange(function (value) {
        object.position.y = value;
    });
    folderControls.add(options, 'positionZ', -50, 50).onChange(function (value) {
        object.position.z = value;
    });

    folderControls.add(options, 'rotationX', -Math.PI, Math.PI).onChange(function (value) {
        object.rotation.x = value;
    });
    folderControls.add(options, 'rotationY', -Math.PI, Math.PI).onChange(function (value) {
        object.rotation.y = value;
    });
    folderControls.add(options, 'rotationZ', -Math.PI, Math.PI).onChange(function (value) {
        object.rotation.z = value;
    });

    folderControls.add(options, 'scaleX', 0.001, 100).onChange(function (value) {
        object.scale.x = value;
    });
    folderControls.add(options, 'scaleY', 0.001, 100).onChange(function (value) {
        object.scale.y = value;
    });
    folderControls.add(options, 'scaleZ', 0.001, 100).onChange(function (value) {
        object.scale.z = value;
    });

    const folderAppearance = folderControls.addFolder('Appearance');
    folderAppearance.addColor(options, 'color').onChange(function (color) {
        object.material.color.set(color);
    });
    folderAppearance.add(options, 'wireframe').onChange(function (value) {
        object.material.wireframe = value;
    });
}

// Usage of GUI:
addObjectControls(gui, box, 'Box', options);
addObjectControls(gui, sphere, 'Sphere', options);
addObjectControls(gui,plane,'Plane',options);

gui.add(options, 'speed', 0, 0.1);

let step = 0;

//Rotate Box (Function)
const tick = () => {
    step += options.speed;
    box.rotation.y += .01;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    render();
    window.requestAnimationFrame(tick);
}

tick();