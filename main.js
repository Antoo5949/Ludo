import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Get canvas element
const canvas = document.getElementById('canvas');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a scene
const scene = new THREE.Scene();

// Set up camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 10, 30); // Adjusted camera position along z-axis

// Create renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.width, canvas.height);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = true;

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    ludo: textureLoader.load('Image/Ludo.jpg'),
    snake: textureLoader.load('Image/snake.jpg'),
};

// Create ludo board
const ludoBoardGeometry = new THREE.PlaneGeometry(10, 10);
const ludoBoardMaterial = new THREE.MeshBasicMaterial({ map: textures.ludo });
const ludoBoard = new THREE.Mesh(ludoBoardGeometry, ludoBoardMaterial);
scene.add(ludoBoard);

// Set position of the ludo board
ludoBoard.position.y = -0.01; // Adjust the position to avoid intersection

// Create dice
const diceTextures = [];
for (let i = 1; i <= 6; i++) {
    diceTextures.push(textureLoader.load(`Image/${i}.png`));
}

const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
const diceMaterials = diceTextures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
const dice = new THREE.Mesh(diceGeometry, diceMaterials);
scene.add(dice);

// Set position of the dice
dice.position.y = 0.5; // Adjust the position above the ludo board
dice.position.z = 0.83; // Adjust the position in front of the ludo board

// Set up event listeners by mouse
let isLudoTexture = true;
document.addEventListener('click', () => {
    isLudoTexture = !isLudoTexture;
    const newTexture = isLudoTexture ? textures.ludo : textures.snake;
    ludoBoard.material.map = newTexture;
    ludoBoard.material.needsUpdate = true;
});

// Animate
function animate() {
    requestAnimationFrame(animate);

    // Rotate dice
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.01;

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);
}

animate();

// Keyboard controls
document.addEventListener('keydown', event => {
    const speed = 0.1;
    switch (event.key) {
        case 'w':
            camera.position.z -= speed;
            break;
        case 'a':
            camera.position.x -= speed;
            break;
        case 's':
            camera.position.z += speed;
            break;
        case 'd':
            camera.position.x += speed;
            break;
    }
});

// Resize canvas with window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
});