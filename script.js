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
renderer.toneMappingExposure = 0.75;
document.querySelector('.model').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xcc8ee8, 1.1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);


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

const createEmissiveMaterial = (color, intensity =2) =>{
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

    mixer = new THREE.AnimationMixer(model);

    if (gltf.animations.length >1) {
        const action = mixer.clipAction(gltf.animations[1]);
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