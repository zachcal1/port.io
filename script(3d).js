import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js'; // Add this import

console.log('Script starting...');

// Check if container exists
const sceneContainer = document.getElementById('threejs-container');
if (!sceneContainer) {
    console.error('Container not found!');
    throw new Error('Container not found');
}
console.log('Container found:', sceneContainer !== null);

// Initialize scene
const scene = new THREE.Scene();
scene.background = null;
console.log('Scene created');

// Setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.5, -1, 10); // x=0.5 and y=-1 (z = 10) higher z is further zoomed out
console.log('Camera set up');

// Setup renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
sceneContainer.appendChild(renderer.domElement);
console.log('Renderer added to container');

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);
console.log('Lights added');

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05; // Adjust damping
controls.enableZoom = false; // Disable zooming
controls.enablePan = false; // Disable panning
controls.rotateSpeed = 1; // Adjust rotation speed
console.log('OrbitControls initialized');




controls.enableRotate = true;

// Test cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
console.log('Test cube added');

// Declare model variable
let model = null;

// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    // Update OrbitControls
    controls.update();

    renderer.render(scene, camera);
}

// Start animation
animate();

// Initialize loader
const loader = new GLTFLoader();
console.log('GLTFLoader created');

// Load model
const modelPath = new URL('./taino.glb', window.location.href).href;
console.log('Attempting to load model from:', modelPath);

loader.load(
    modelPath,
    (gltf) => {
        console.log('Model loaded successfully:', gltf);
        model = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Adjust position to center the model
        model.position.sub(center); // Center the model
        model.position.y += size.y / 2; // Lift the model to ensure it's fully visible

        model.position.x += 0.1; // Adjust X-axis (move slightly to the right)
        model.position.z += 0.05; // Adjust Z-axis (move slightly forward)

        model.rotation.x = Math.PI / 2; // Rotate 90 degrees on the X-axis
        model.rotation.y = 0;           // Ensure no rotation on the Y-axis
        model.rotation.z = 0;           // Ensure no rotation on the Z-axis

        model.scale.set(1, 1, 1);
        scene.add(model);

        // Hide test cube when model loads
        cube.visible = false;

        console.log('Model added to scene');
    },
    (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log('Loading progress:', percentComplete.toFixed(2) + '%');
    },
    (error) => {
        console.error('Error loading model:', error);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            stack: error.stack
        });
    }
);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function handleNavVisibility() {
    const nav = document.querySelector('nav');
    const mainSection = document.querySelector('.main');
    
    function updateNavVisibility() {
        const mainRect = mainSection.getBoundingClientRect();
        const isMainVisible = mainRect.top <= 80; // 80px is nav height
        
        if (isMainVisible) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    }
    
    // Force initial state
    nav.classList.remove('visible');
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateNavVisibility);
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateNavVisibility);
    });
}

function openMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('open'); // Toggle the 'open' class on the nav element
    console.log('Menu toggled');
}

window.openMenu = openMenu;

// Remove the duplicate initialization
document.addEventListener('DOMContentLoaded', () => {
    handleNavVisibility();
});