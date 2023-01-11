
function init() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45.0 , window.innerWidth/window.innerHeight , 0.0001 , 1000);
  camera.position.x =-5;
  camera.position.z= 5;
  camera.position.y= 7;
  camera.lookAt(new THREE.Vector3(0,0,0));

  let box = getBox(1,1,1,getMaterial('standard'));

  let pointLight = getPointLight(6);
  pointLight.position.x = -3;
  pointLight.position.z = -3;
  pointLight.position.y = 7;



  let sphere = getSphere(0.1,32,getMaterial('basic','rgb(255,255,255)'));
  pointLight.add(sphere);
  let planeMaterial = getMaterial('standard','rgb(128,128,128)');
  let plane = getPlane(20,planeMaterial);


  sphereMaterial = getMaterial('standard','rgb(128,128,128)');
  let bigSphere = getSphere(3,32,sphereMaterial);

  





  scene.add(camera);

  scene.add(bigSphere);
  
  //scene.add(loader3d);

  scene.add(plane);

  scene.add(pointLight);


const gui = new dat.GUI();
const lightFolder = gui.addFolder('Light Controler');
lightFolder.add(pointLight,'intensity', 0 , 10 );
lightFolder.add(pointLight.position,'x', -15 , 15 );
lightFolder.add(pointLight.position,'y', -15 , 15 );
lightFolder.add(pointLight.position,'z', -15 , 15 );

const cameraFolder =gui.addFolder('Camera Location');
cameraFolder.add(camera.position,'x',-15,15);
cameraFolder.add(camera.position,'y',-15,15);
cameraFolder.add(camera.position,'z',-15,15);


var path = './assets/cubemap/';
var format = '.jpg';
var urls = [
  path+'px'+format,
  path+'nx'+format,
  path+'py'+format,
  path+'ny'+format,
  path+'pz'+format,
  path+'nz'+format
];
var reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.format = THREE.RGBFormat;

scene.background = reflectionCube;

var loader3d = new THREE.GLTFLoader();
loader3d.load("scene.gltf",function(gltf){
  scene.add(gltf.scene);
});

var loader = new THREE.TextureLoader();
planeMaterial.map = loader.load('/assets/textures/concrete.jpg');
planeMaterial.bumpMap = loader.load('/assets/textures/checkerboard.jpg');
planeMaterial.roughnessMap = loader.load('/assets/textures/scratch.jpg');
planeMaterial.bumpScale = 0.01;
planeMaterial.metalness = 0.1;
planeMaterial.roughness = 0.7;
planeMaterial.envMap = reflectionCube;
sphereMaterial.roughnessMap = loader.load('/assets/textures/fingerprint.jpg');
sphereMaterial.envMap = reflectionCube;

var maps = ['map', 'bumpMap' , 'roughnessMap'];
maps.forEach(function(mapName){
  var texture = planeMaterial[mapName];
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1,1);
});






const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor('rgb(128,128,128)');
renderer.shadowMap.enabled=true; 

document.getElementById('webgl').appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera,renderer.domElement);
update(renderer,scene,camera,controls);

}


function update(renderer,scene,camera,controls){
  renderer.render(scene,camera);
controls.update();
requestAnimationFrame(function(){
  update(renderer,scene,camera,controls);
});
}

init();



function getBox(w = 1,h = 1,d = 1 , material=getMaterial()) {
  let geometry = new THREE.BoxGeometry(w,h,d);
  let mesh = new THREE.Mesh(geometry,material);
  mesh.position.y=h/2;
  mesh.castShadow=true; 
  return mesh;
      }


//------------------------------------------------//
function getSphere(radius = 0.5,segments = 32,material=getMaterial()) {
  let sphere = new THREE.SphereGeometry(radius,segments,segments);
  let mesh = new THREE.Mesh(sphere,material);
  mesh.position.y=radius;
  mesh.position.x=5;
  mesh.position.z=0.5;
  mesh.castShadow=true;
  return mesh;
}


//-----------------------------------------------//
function getPlane(size = 1 , material = getMaterial()) {
  let geometry = new THREE.PlaneGeometry(size,size);
  let mesh = new THREE.Mesh(geometry,material);
  mesh.rotateX(-Math.PI/2);
  mesh.receiveShadow=true;
  return mesh;
}





function getMaterial(type = 'basic' , color = 'rgb(128,128,128)'){
let material;
let materialOption = {color:color}
switch (type){
  case 'standard':
    material = new THREE.MeshStandardMaterial(materialOption);
    break;
  case 'phong':
    material=new THREE.MeshPhongMaterial(materialOption);
    break;
  case 'lambert':
    material=new THREE.MeshLambertMaterial(materialOption);
    break;
  case 'basic':
  default :
  material = new THREE.MeshBasicMaterial(materialOption);
  break;
}
return material;
}




function getPointLight(intensity,color = 'rgb(255,255,255)') {
  let light = new THREE.PointLight(color,intensity);
  light.castShadow = true;
  light.shadow.bias=0.0000000001;
  light.shadow.mapSize.width=2048;
  light.shadow.mapSize.height=2048;
  return light;
}


