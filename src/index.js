import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const width = window.innerWidth;
const height = window.innerHeight;

//---
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//---
const scene = new THREE.Scene();

//---
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
camera.position.set(0, 200, 200);

//---
const obControls = new OrbitControls(camera, renderer.domElement);

//---
const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
light1.position.set(1, 1, 1);
scene.add(light1);

//---
const light2 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light2);

//---
drawGrid(scene);

//---
const box = drawObject(scene);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

function drawGrid(scene) {
    const grid = new THREE.GridHelper(1000, 20);
    scene.add(grid);

    return grid;
}

function drawObject(scene) {
    const group = new THREE.Group();

    const g1 = new THREE.BoxGeometry(20, 5, 200);
    const m1 = new THREE.MeshPhongMaterial({color: 0xff0000});
    const mesh1 = new THREE.Mesh(g1, m1);
    mesh1.position.setY(2.5);

    const g2 = new THREE.ConeGeometry(100, 20, 3);
    const m2 = new THREE.MeshPhongMaterial({color: 0x0000ff});
    const mesh2 = new THREE.Mesh(g2, m2);
    mesh2.rotation.z = Math.PI;
    mesh2.position.setY(-10);

    group.add(mesh1);
    group.add(mesh2);

    scene.add(group);

    return group;
}

//==============================================================================================

// 웹소켓 전역 객체 생성
const ws = new WebSocket("ws://localhost:3000");

// 연결이 수립되면 서버에 메시지를 전송한다
ws.onopen = function(evt) {
    console.log('web socket open');
}

// 서버로 부터 메시지를 수신한다
const radian = Math.PI / 180;

ws.onmessage = function(evt) {
    const arr = evt.data.split(',');
    const rX = radian * parseInt(arr[0], 10);
    const rZ = radian * parseInt(arr[1], 10);

    // const gX = parseInt(arr[2], 10) / 100;
    // const gY = parseInt(arr[3], 10) / 100;
    // const gZ = parseInt(arr[4], 10) / 100;


    box.rotation.set(rX, 0, -rZ);
    // box.position.set(gX, gY, gZ);
}

// 오류.
ws.onerror = function(evt) {
    console.error("error : " + evt.data);
}