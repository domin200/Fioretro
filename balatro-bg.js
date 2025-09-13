// Balatro-style animated background using WebGL
class BalatroBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            spinRotation: options.spinRotation ?? -2.0,
            spinSpeed: options.spinSpeed ?? 7.0,
            offset: options.offset ?? [0.0, 0.0],
            color1: options.color1 ?? '#DE443B',
            color2: options.color2 ?? '#006BB4',
            color3: options.color3 ?? '#162325',
            contrast: options.contrast ?? 3.5,
            lighting: options.lighting ?? 0.4,
            spinAmount: options.spinAmount ?? 0.25,
            pixelFilter: options.pixelFilter ?? 745.0,
            spinEase: options.spinEase ?? 1.0,
            isRotate: options.isRotate ?? false,
            mouseInteraction: options.mouseInteraction ?? true
        };
        
        this.init();
    }
    
    hexToVec4(color) {
        let r = 0, g = 0, b = 0, a = 1;
        
        // HSL 색상 처리
        if (color.startsWith('hsl')) {
            const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (hslMatch) {
                const h = parseInt(hslMatch[1]) / 360;
                const s = parseInt(hslMatch[2]) / 100;
                const l = parseInt(hslMatch[3]) / 100;
                
                // HSL to RGB conversion
                let c = (1 - Math.abs(2 * l - 1)) * s;
                let x = c * (1 - Math.abs((h * 6) % 2 - 1));
                let m = l - c / 2;
                
                let r1, g1, b1;
                if (h * 6 < 1) { r1 = c; g1 = x; b1 = 0; }
                else if (h * 6 < 2) { r1 = x; g1 = c; b1 = 0; }
                else if (h * 6 < 3) { r1 = 0; g1 = c; b1 = x; }
                else if (h * 6 < 4) { r1 = 0; g1 = x; b1 = c; }
                else if (h * 6 < 5) { r1 = x; g1 = 0; b1 = c; }
                else { r1 = c; g1 = 0; b1 = x; }
                
                r = r1 + m;
                g = g1 + m;
                b = b1 + m;
            }
        }
        // HEX 색상 처리
        else if (color.startsWith('#')) {
            let hexStr = color.replace('#', '');
            if (hexStr.length === 6) {
                r = parseInt(hexStr.slice(0, 2), 16) / 255;
                g = parseInt(hexStr.slice(2, 4), 16) / 255;
                b = parseInt(hexStr.slice(4, 6), 16) / 255;
            } else if (hexStr.length === 8) {
                r = parseInt(hexStr.slice(0, 2), 16) / 255;
                g = parseInt(hexStr.slice(2, 4), 16) / 255;
                b = parseInt(hexStr.slice(4, 6), 16) / 255;
                a = parseInt(hexStr.slice(6, 8), 16) / 255;
            }
        }
        
        return [r, g, b, a];
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.container.appendChild(this.canvas);
        
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        // Set up shaders
        this.setupShaders();
        
        // Set up geometry
        this.setupGeometry();
        
        // Set up uniforms
        this.setupUniforms();
        
        // Handle resize
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Handle mouse
        if (this.options.mouseInteraction) {
            this.setupMouseInteraction();
        }
        
        // Start animation
        this.animate();
    }
    
    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 position;
            attribute vec2 uv;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `;
        
        const fragmentShaderSource = `
            precision highp float;
            
            #define PI 3.14159265359
            
            uniform float iTime;
            uniform vec3 iResolution;
            uniform float uSpinRotation;
            uniform float uSpinSpeed;
            uniform vec2 uOffset;
            uniform vec4 uColor1;
            uniform vec4 uColor2;
            uniform vec4 uColor3;
            uniform float uContrast;
            uniform float uLighting;
            uniform float uSpinAmount;
            uniform float uPixelFilter;
            uniform float uSpinEase;
            uniform float uIsRotate;
            uniform vec2 uMouse;
            
            varying vec2 vUv;
            
            vec4 effect(vec2 screenSize, vec2 screen_coords) {
                float pixel_size = length(screenSize.xy) / uPixelFilter;
                vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
                float uv_len = length(uv);
                
                float speed = (uSpinRotation * uSpinEase * 0.2);
                if(uIsRotate > 0.5){
                   speed = iTime * speed;
                }
                speed += 302.2;
                
                float mouseInfluence = (uMouse.x * 2.0 - 1.0);
                speed += mouseInfluence * 0.1;
                
                float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
                vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
                uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
                
                uv *= 30.0;
                float baseSpeed = iTime * uSpinSpeed;
                speed = baseSpeed + mouseInfluence * 2.0;
                
                vec2 uv2 = vec2(uv.x + uv.y);
                
                for(int i = 0; i < 5; i++) {
                    uv2 += sin(max(uv.x, uv.y)) + uv;
                    uv += 0.5 * vec2(
                        cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
                        sin(uv2.x - 0.113 * speed)
                    );
                    uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
                }
                
                float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
                float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
                float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
                float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
                float c3p = 1.0 - min(1.0, c1p + c2p);
                float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
                
                return (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
            }
            
            void main() {
                vec2 uv = vUv * iResolution.xy;
                gl_FragColor = effect(iResolution.xy, uv);
            }
        `;
        
        // Create shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Failed to link program:', this.gl.getProgramInfoLog(this.program));
        }
        
        this.gl.useProgram(this.program);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    setupGeometry() {
        // Create a full-screen triangle
        const vertices = new Float32Array([
            -1, -1, 0, 0,
            3, -1, 2, 0,
            -1, 3, 0, 2
        ]);
        
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        // Set up attributes
        const positionLoc = this.gl.getAttribLocation(this.program, 'position');
        const uvLoc = this.gl.getAttribLocation(this.program, 'uv');
        
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.enableVertexAttribArray(uvLoc);
        
        this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 16, 0);
        this.gl.vertexAttribPointer(uvLoc, 2, this.gl.FLOAT, false, 16, 8);
    }
    
    setupUniforms() {
        this.uniforms = {
            iTime: this.gl.getUniformLocation(this.program, 'iTime'),
            iResolution: this.gl.getUniformLocation(this.program, 'iResolution'),
            uSpinRotation: this.gl.getUniformLocation(this.program, 'uSpinRotation'),
            uSpinSpeed: this.gl.getUniformLocation(this.program, 'uSpinSpeed'),
            uOffset: this.gl.getUniformLocation(this.program, 'uOffset'),
            uColor1: this.gl.getUniformLocation(this.program, 'uColor1'),
            uColor2: this.gl.getUniformLocation(this.program, 'uColor2'),
            uColor3: this.gl.getUniformLocation(this.program, 'uColor3'),
            uContrast: this.gl.getUniformLocation(this.program, 'uContrast'),
            uLighting: this.gl.getUniformLocation(this.program, 'uLighting'),
            uSpinAmount: this.gl.getUniformLocation(this.program, 'uSpinAmount'),
            uPixelFilter: this.gl.getUniformLocation(this.program, 'uPixelFilter'),
            uSpinEase: this.gl.getUniformLocation(this.program, 'uSpinEase'),
            uIsRotate: this.gl.getUniformLocation(this.program, 'uIsRotate'),
            uMouse: this.gl.getUniformLocation(this.program, 'uMouse')
        };
        
        // Set initial uniform values
        this.gl.uniform1f(this.uniforms.uSpinRotation, this.options.spinRotation);
        this.gl.uniform1f(this.uniforms.uSpinSpeed, this.options.spinSpeed);
        this.gl.uniform2fv(this.uniforms.uOffset, this.options.offset);
        this.gl.uniform4fv(this.uniforms.uColor1, this.hexToVec4(this.options.color1));
        this.gl.uniform4fv(this.uniforms.uColor2, this.hexToVec4(this.options.color2));
        this.gl.uniform4fv(this.uniforms.uColor3, this.hexToVec4(this.options.color3));
        this.gl.uniform1f(this.uniforms.uContrast, this.options.contrast);
        this.gl.uniform1f(this.uniforms.uLighting, this.options.lighting);
        this.gl.uniform1f(this.uniforms.uSpinAmount, this.options.spinAmount);
        this.gl.uniform1f(this.uniforms.uPixelFilter, this.options.pixelFilter);
        this.gl.uniform1f(this.uniforms.uSpinEase, this.options.spinEase);
        this.gl.uniform1f(this.uniforms.uIsRotate, this.options.isRotate ? 1.0 : 0.0);
        this.gl.uniform2f(this.uniforms.uMouse, 0.5, 0.5);
    }
    
    setupMouseInteraction() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            this.gl.uniform2f(this.uniforms.uMouse, x, y);
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform3f(this.uniforms.iResolution, this.canvas.width, this.canvas.height, this.canvas.width / this.canvas.height);
    }
    
    animate() {
        const startTime = Date.now();
        
        const render = () => {
            const time = (Date.now() - startTime) * 0.001;
            this.gl.uniform1f(this.uniforms.iTime, time);
            
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}