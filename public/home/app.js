var hamburger = document.getElementById('hamburger');
var closeButton = document.getElementById('closeButton');
var work = document.getElementById('work');
var about = document.getElementById('about');
var resources = document.getElementById('resources');
var arena = document.getElementById('arena');
var behance = document.getElementById('behance');
var dribble = document.getElementById('dribble');
var instagram = document.getElementById('instagram');
var linkedIn = document.getElementById('linkedIn');
var project1 = document.getElementById('project1');
var project2 = document.getElementById('project2');
var project3 = document.getElementById('project3');

hamburger.addEventListener('touchend', function() {
  const sidebar = document.getElementById('menu');
  sidebar.classList.toggle('open');
});

closeButton.addEventListener('touchend', function() {
  const sidebar = document.getElementById('menu');
  sidebar.classList.toggle('open');
});

work.addEventListener('touchend', function() {
    window.location.href = 'work';
});

about.addEventListener('touchend', function() {
  window.location.href = 'about';
});

resources.addEventListener('touchend', function() {
  window.location.href = 'resources';
});

playground.addEventListener('touchend', function() {
  window.location.href = 'playground';
});

arena.addEventListener('touchend', function() {
  window.location.href = 'https://www.are.na/ethan-wright';
});

behance.addEventListener('touchend', function() {
  window.location.href = 'https://www.behance.net/theethanwright';
});

dribble.addEventListener('touchend', function() {
  window.location.href = 'https://www.instagram.com/theethanwright/';
});

linkedIn.addEventListener('touchend', function() {
  window.location.href = 'https://www.linkedin.com/in/ethan-wright-76751321a/';
});

class SphericalImageGallery {
    constructor(images, backgroundColor = 0x000000, radius = 12) {
        // Cache frequently used values
        this.rotationSpeedY = -0.001;
        this.rotationSpeedX = 0.0001;
        this.imageSize = 5;
        this.images = images;
        this.radius = radius;
        
        // Initialize scene only once
        this.initScene(backgroundColor);
        this.initCamera();
        this.initRenderer();
        
        // Use object pooling for geometry and materials
        this.geometry = new THREE.PlaneGeometry(this.imageSize, this.imageSize);
        this.textureLoader = new THREE.TextureLoader();
        
        // Group initialization
        this.imageGroup = new THREE.Group();
        this.scene.add(this.imageGroup);
        
        // Initialize once
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Bind methods once
        this.boundAnimate = this.animate.bind(this);
        this.boundOnWindowResize = this.onWindowResize.bind(this);
        this.boundOnMouseMove = this.onMouseMove.bind(this);
        this.boundOnClick = this.onClick.bind(this);
        
        this.setupEventListeners();
        this.createImageSphere();
        this.setupPostProcessing();
        
        // Camera rotation parameters
        this.rotationVelocity = new THREE.Vector2(0, 0);
        this.mouseDelta = new THREE.Vector2(0, 0);
        this.lastMousePosition = new THREE.Vector2(0, 0);
        this.isMouseMoving = false;
        
        // Movement configuration
        this.friction = 0.95;          // How quickly rotation slows down (0-1)
        this.sensitivity = 0.001;      // How much mouse movement affects rotation
        this.maxVelocity = 0.05;       // Maximum rotation speed
        this.rotationBounds = {        // Limit vertical rotation to avoid flipping
            minY: -Math.PI / 3,        // -60 degrees
            maxY: Math.PI / 3          // 60 degrees
        };
        
        // Initialize camera rotation
        this.cameraRotation = new THREE.Vector2(0, 0);
        
        // Debug settings
        this.debug = {
            enabled: true,
            showOverlay: true,
            showConsole: false,
            values: {
                rotation: new THREE.Vector2(),
                velocity: new THREE.Vector2(),
                mouseDelta: new THREE.Vector2(),
                distanceFromCenter: 0
            }
        };

        // Create debug overlay if enabled
        if (this.debug.enabled && this.debug.showOverlay) {
            this.createDebugOverlay();
        }
        
        // Start animation
        this.boundAnimate();
    }

    initScene(backgroundColor) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(backgroundColor);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            25,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 0;
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
        document.body.appendChild(this.renderer.domElement);
    }

    setupEventListeners() {
        // Use passive event listeners where possible
        window.addEventListener('resize', this.boundOnWindowResize, { passive: true });
        this.renderer.domElement.addEventListener('mousemove', this.boundOnMouseMove, { passive: true });
        this.renderer.domElement.addEventListener('click', this.boundOnClick);
    }

    createImageSphere() {
        const imageCount = this.images.length;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        
        // Pre-calculate values
        const imagePromises = this.images.map((imageUrl, index) => {
            return new Promise((resolve) => {
                this.textureLoader.load(imageUrl, (texture) => {
                    texture.generateMipmaps = true;
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    
                    const material = new THREE.MeshBasicMaterial({ map: texture });
                    const mesh = new THREE.Mesh(this.geometry, material);
                    
                    // Fibonacci sphere distribution
                    const phi = Math.acos(1 - 2 * (index + 0.5) / imageCount);
                    const theta = 2 * Math.PI * index / goldenRatio;
                    
                    mesh.position.set(
                        this.radius * Math.sin(phi) * Math.cos(theta),
                        this.radius * Math.sin(phi) * Math.sin(theta),
                        this.radius * Math.cos(phi)
                    );
                    
                    mesh.lookAt(this.scene.position);
                    mesh.userData = { index, url: imageUrl };
                    
                    this.imageGroup.add(mesh);
                    resolve(mesh);
                });
            });
        });

        Promise.all(imagePromises).then(meshes => {
            this.imageMeshes = meshes;
        });
    }

    setupPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer);
        this.renderPass = new THREE.RenderPass(this.scene, this.camera);
        
        const lensDistortionShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "k": { value: -0.12 },
                "kcube": { value: -0.5 },
                "debug": { value: false },        // Debug flag
                "debugGrid": { value: false }     // Show debug grid
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float k;
                uniform float kcube;
                uniform bool debug;
                uniform bool debugGrid;
                varying vec2 vUv;

                // Debug function to visualize distortion
                vec4 debugColor(vec2 uv, vec2 distortedUv) {
                    // Show grid
                    if (debugGrid) {
                        float gridSize = 0.1;
                        vec2 grid = fract(distortedUv / gridSize);
                        float line = step(0.95, max(grid.x, grid.y));
                        
                        // Original texture
                        vec4 color = texture2D(tDiffuse, distortedUv);
                        
                        // Overlay grid
                        return mix(color, vec4(1.0, 0.0, 0.0, 1.0), line * 0.5);
                    }
                    
                    // Show distortion amount
                    float distortionAmount = length(distortedUv - uv);
                    return vec4(distortionAmount * 5.0, 0.0, 0.0, 1.0);
                }

                void main() {
                    vec2 uv = vUv - 0.5;
                    float r2 = dot(uv, uv);
                    float f = 1.0 + r2 * (k + kcube * sqrt(r2));
                    
                    vec2 distortedUv = (uv * f) + 0.5;
                    
                    // Check bounds
                    bool outOfBounds = any(lessThan(distortedUv, vec2(0.0))) || 
                                     any(greaterThan(distortedUv, vec2(1.0)));
                    
                    if (outOfBounds) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                        return;
                    }
                    
                    if (debug) {
                        gl_FragColor = debugColor(vUv, distortedUv);
                    } else {
                        gl_FragColor = texture2D(tDiffuse, distortedUv);
                    }
                }
            `
        };

        this.lensPass = new THREE.ShaderPass(lensDistortionShader);
        this.lensPass.renderToScreen = true;

        // Add debug controls
        this.debugControls = {
            k: this.lensPass.uniforms.k.value,
            kcube: this.lensPass.uniforms.kcube.value,
            debug: this.lensPass.uniforms.debug.value,
            debugGrid: this.lensPass.uniforms.debugGrid.value
        };

        // Log initial values
        console.log('Shader Debug Info:', {
            k: this.debugControls.k,
            kcube: this.debugControls.kcube
        });

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.lensPass);
    }

    // Add method to update shader parameters
    updateShaderParams(params) {
        if (params.k !== undefined) {
            this.lensPass.uniforms.k.value = params.k;
            console.log('Updated k:', params.k);
        }
        if (params.kcube !== undefined) {
            this.lensPass.uniforms.kcube.value = params.kcube;
            console.log('Updated kcube:', params.kcube);
        }
        if (params.debug !== undefined) {
            this.lensPass.uniforms.debug.value = params.debug;
        }
        if (params.debugGrid !== undefined) {
            this.lensPass.uniforms.debugGrid.value = params.debugGrid;
        }
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    onMouseMove(event) {
        // Calculate mouse movement (delta)
        const currentMouseX = event.clientX;
        const currentMouseY = event.clientY;
        
        this.mouseDelta.x = currentMouseX - this.lastMousePosition.x;
        this.mouseDelta.y = currentMouseY - this.lastMousePosition.y;
        
        // Update rotation velocity based on mouse movement
        this.rotationVelocity.x += (this.mouseDelta.x * this.sensitivity);
        this.rotationVelocity.y += (this.mouseDelta.y * this.sensitivity);
        
        // Clamp velocity
        this.rotationVelocity.x = Math.max(Math.min(this.rotationVelocity.x, this.maxVelocity), -this.maxVelocity);
        this.rotationVelocity.y = Math.max(Math.min(this.rotationVelocity.y, this.maxVelocity), -this.maxVelocity);
        
        // Store current position for next frame
        this.lastMousePosition.x = currentMouseX;
        this.lastMousePosition.y = currentMouseY;
        
        this.isMouseMoving = true;
    }

    onClick(event) {
        if (!this.imageMeshes) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.imageMeshes);

        if (intersects.length > 0) {
            window.open(intersects[0].object.userData.url, '_blank');
        }
    }

    updateCamera() {
        // Apply velocity to camera rotation
        this.cameraRotation.x += this.rotationVelocity.x;
        this.cameraRotation.y += this.rotationVelocity.y;
        
        // Clamp vertical rotation to avoid flipping
        this.cameraRotation.y = Math.max(
            Math.min(this.cameraRotation.y, this.rotationBounds.maxY),
            this.rotationBounds.minY
        );
        
        // Apply friction when mouse isn't moving
        if (!this.isMouseMoving) {
            this.rotationVelocity.multiplyScalar(this.friction);
            
            // Stop completely if movement is very small
            if (Math.abs(this.rotationVelocity.x) < 0.0001) this.rotationVelocity.x = 0;
            if (Math.abs(this.rotationVelocity.y) < 0.0001) this.rotationVelocity.y = 0;
        }
        
        // Reset mouse moving flag
        this.isMouseMoving = false;
        
        // Apply rotation to camera
        const radius = 20; // Distance from center
        this.camera.position.x = radius * Math.sin(this.cameraRotation.x) * Math.cos(this.cameraRotation.y);
        this.camera.position.y = radius * Math.sin(this.cameraRotation.y);
        this.camera.position.z = radius * Math.cos(this.cameraRotation.x) * Math.cos(this.cameraRotation.y);
        
        // Look at center
        this.camera.lookAt(this.scene.position);
        
        // Update debug info
        this.updateDebugInfo();
    }

    animate() {
        requestAnimationFrame(this.boundAnimate);
        
        // Update camera position
        this.updateCamera();
        
        // Existing animation code
        this.imageGroup.rotation.y += this.rotationSpeedY;
        this.imageGroup.rotation.x += this.rotationSpeedX
        this.composer.render();
    }

    createDebugOverlay() {
        this.debugOverlay = document.createElement('div');
        this.debugOverlay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            border-radius: 4px;
        `;
        document.body.appendChild(this.debugOverlay);
    }

    updateDebugInfo() {
        if (!this.debug.enabled) return;

        // Update debug values
        this.debug.values.rotation = new THREE.Vector2(
            (this.cameraRotation.x * 180 / Math.PI).toFixed(2),
            (this.cameraRotation.y * 180 / Math.PI).toFixed(2)
        );
        this.debug.values.velocity = new THREE.Vector2(
            (this.rotationVelocity.x * 180 / Math.PI).toFixed(4),
            (this.rotationVelocity.y * 180 / Math.PI).toFixed(4)
        );
        this.debug.values.mouseDelta = new THREE.Vector2(
            this.mouseDelta.x.toFixed(2),
            this.mouseDelta.y.toFixed(2)
        );

        // Update overlay if enabled
        if (this.debug.showOverlay && this.debugOverlay) {
            this.debugOverlay.innerHTML = `
                Camera Rotation (deg): (${this.debug.values.rotation.x}, ${this.debug.values.rotation.y})<br>
                Rotation Velocity (deg/s): (${this.debug.values.velocity.x}, ${this.debug.values.velocity.y})<br>
                Mouse Delta: (${this.debug.values.mouseDelta.x}, ${this.debug.values.mouseDelta.y})<br>
                Mouse Moving: ${this.isMouseMoving}<br>
            `;
        }

        // Console logging if enabled
        if (this.debug.showConsole) {
            console.log('Debug Values:', this.debug.values);
        }
    }

    // Add debug methods
    toggleDebug() {
        this.debug.enabled = !this.debug.enabled;
        if (this.debug.enabled && this.debug.showOverlay) {
            this.createDebugOverlay();
        } else if (this.debugOverlay) {
            this.debugOverlay.remove();
        }
    }

    setDebugOptions(options) {
        Object.assign(this.debug, options);
        if (!this.debug.showOverlay && this.debugOverlay) {
            this.debugOverlay.remove();
        } else if (this.debug.showOverlay && this.debug.enabled && !this.debugOverlay) {
            this.createDebugOverlay();
        }
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'https://picsum.photos/500/500?random=1',
        'https://picsum.photos/500/500?random=2',
        'https://picsum.photos/500/500?random=3',
        'https://picsum.photos/500/500?random=4',
        'https://picsum.photos/500/500?random=5',
        'https://picsum.photos/500/500?random=6',
        'https://picsum.photos/500/500?random=7',
        'https://picsum.photos/500/500?random=8',
        'https://picsum.photos/500/500?random=9',
        'https://picsum.photos/500/500?random=10',
        'https://picsum.photos/500/500?random=11',
        'https://picsum.photos/500/500?random=12',
        'https://picsum.photos/500/500?random=13',
        'https://picsum.photos/500/500?random=14',
        'https://picsum.photos/500/500?random=15',
        'https://picsum.photos/500/500?random=16',
        'https://picsum.photos/500/500?random=17',
        'https://picsum.photos/500/500?random=18',
        'https://picsum.photos/500/500?random=19',
        'https://picsum.photos/500/500?random=20'
    ];
    
    // Create gallery instance
    const gallery = new SphericalImageGallery(images, 0x1a1a2e, 15);
    // Configure rotation
    gallery.sensitivity = 0.00001;   // Smaller value for rotation
    gallery.friction = 0.95;       // Smooth slowdown
    gallery.maxVelocity = 0.005;    // Maximum rotation speed
    
    // Make gallery accessible globally for debugging
    window.gallery = gallery;

    // Debug controls example:
    console.log(`
        Debug Controls Available:
        - gallery.toggleDebug()
        - gallery.setDebugOptions({ showOverlay: true/false, showConsole: true/false })
        - gallery.sensitivity = value
        - gallery.friction = value
        - gallery.maxVelocity = value
        - gallery.boundaryRadius = value
    `);
});