
const hamburger = document.getElementById('hamburger')
const navItems = document.getElementById('navItems')


hamburger.addEventListener('click',()=>{
    navItems.classList.toggle('show')    
})
function myFunction(hamburger) {
    hamburger.classList.toggle("change");
  }


document.addEventListener('DOMContentLoaded',()=>{
    const snowWrapper = document.querySelector('.snow-wrapper');
    const snowCount = 50;

    for (let i = 0; i < snowCount; i++) {
        const snow = document.createElement('div');
        snow.classList.add('snow');
        const size = Math.random() * 20 + 5; 
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;

        snow.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 5 + 5; 
        const delay = Math.random() * 5; 
        snow.style.animationDuration = `${duration}s`;
        snow.style.animationDelay = `${delay}s`;

        snowWrapper.appendChild(snow);
    }
})
function resizeSnowflakes() {
    const snowflakes = document.querySelectorAll('.snow');
    snowflakes.forEach(snow => {
        let size;
        if (window.innerWidth < 768) {
            size = Math.random() * 10 + 5; 
        } else {
            size = Math.random() * 20 + 5; 
        }
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
    });
}

window.addEventListener('resize', resizeSnowflakes);


const ctaOverlay = document.querySelector('.cta-overlay');
        const modelDiv = document.querySelector('.model');

        modelDiv.addEventListener('mousedown', () => {
            ctaOverlay.style.display = 'none';
        });

        modelDiv.addEventListener('wheel', () => {
            ctaOverlay.style.display = 'none';
        });



const scene = new THREE.Scene(); 
scene.background = new THREE.Color(0x460E0E);

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 10, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.querySelector('.model').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xaf51ff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFD51F, 0.2);
directionalLight.position.set(0, 15, 15);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.x = 2048;
directionalLight.shadow.mapSize.y = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0xff489f, 0.6);
directionalLight1.position.set(5, 20, -8);
directionalLight1.castShadow = true;
directionalLight1.shadow.mapSize.x = 2048;
directionalLight1.shadow.mapSize.y = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffa646, 0.6);
directionalLight2.position.set(0, -5, 25);
directionalLight2.castShadow = true;
directionalLight2.shadow.mapSize.width = 2048;
directionalLight2.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = 50;
directionalLight.shadow.camera.right = -50;
directionalLight.shadow.camera.top = -50;
directionalLight.shadow.camera.bottom = 50;
scene.add(directionalLight2); 


const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4,
    1,
    0.1
);
composer.addPass(bloomPass);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor= 0.05;
controls.enableRotation = true;
controls.minDistance = 10;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI/2;

const createEmissiveMaterial = (color, intensity =5) =>{
    return new THREE.MeshStandardMaterial({
        color:color,
        emissive:color,
        emissiveIntensity: intensity,
        toneMapping: false,
    });
};

const loader = new THREE.GLTFLoader();
let mixer;
loader.load('./assets/Jack_Skeletron_funko_EXPORT.gltf', function(gltf){
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true; 
            node.receiveShadow = true; 
        }
    });

    mixer = new THREE.AnimationMixer(model);

    if (gltf.animations.length >1) {
        const action = mixer.clipAction(gltf.animations[2]);
        action.play()
    
    };
    
    undefined,
    (error) =>{
        console.error('An error occured:', error);
    }

    scene.add(model);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
    controls.update();
    composer.render();
}

animate();

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});