// Pixi.js 특수 효과 및 시각 효과 관리

class VisualEffectsManager {
    constructor() {
        this.app = null;
        this.filters = {};
        this.initialized = false;
    }

    // Pixi.js 초기화
    init() {
        if (this.initialized || typeof PIXI === 'undefined') return;

        // Pixi 애플리케이션 생성
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        // 오버레이 캔버스를 body에 추가
        this.app.view.style.position = 'fixed';
        this.app.view.style.top = '0';
        this.app.view.style.left = '0';
        this.app.view.style.pointerEvents = 'none';
        this.app.view.style.zIndex = '9999';
        document.body.appendChild(this.app.view);

        // Bloom 필터 생성
        if (PIXI.filters && PIXI.filters.AdvancedBloomFilter) {
            this.filters.bloom = new PIXI.filters.AdvancedBloomFilter({
                threshold: 0.4,
                bloomScale: 1.5,
                brightness: 1.2,
                blur: 8,
                quality: 10
            });
        }

        // Displacement 필터 생성
        if (PIXI.filters && PIXI.filters.DisplacementFilter) {
            const displacementSprite = PIXI.Sprite.from('new card/back.png');
            displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            this.filters.displacement = new PIXI.filters.DisplacementFilter(displacementSprite);
            this.filters.displacement.scale.x = 30;
            this.filters.displacement.scale.y = 30;
        }

        // 윈도우 리사이즈 처리
        window.addEventListener('resize', () => this.resize());

        this.initialized = true;
    }

    // 리사이즈 처리
    resize() {
        if (!this.app) return;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    // 카드 플레이 효과
    playCardEffect(x, y, type = 'normal') {
        if (!this.app) return;

        const container = new PIXI.Container();

        // 기본 파티클 이펙트
        this.createParticleBurst(container, x, y, type);

        // 타입별 특수 효과
        switch(type) {
            case 'rare':
                this.createGlowEffect(container, x, y);
                break;
            case 'combo':
                this.createComboEffect(container, x, y);
                break;
            case 'critical':
                this.createCriticalEffect(container, x, y);
                break;
        }

        this.app.stage.addChild(container);

        // 일정 시간 후 제거
        setTimeout(() => {
            this.app.stage.removeChild(container);
            container.destroy();
        }, 3000);
    }

    // 파티클 버스트 효과
    createParticleBurst(container, x, y, type) {
        const particleCount = type === 'rare' ? 30 : 20;
        const colors = {
            normal: 0xFFFFFF,
            rare: 0xFFD700,
            combo: 0x00FF00,
            critical: 0xFF0000
        };

        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(colors[type] || colors.normal);
            particle.drawCircle(0, 0, Math.random() * 3 + 1);
            particle.endFill();

            particle.x = x;
            particle.y = y;

            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 5 + 2;
            const life = Math.random() * 60 + 30;

            container.addChild(particle);

            // 애니메이션
            let frame = 0;
            const animate = () => {
                frame++;
                particle.x += Math.cos(angle) * speed;
                particle.y += Math.sin(angle) * speed;
                particle.alpha = 1 - (frame / life);
                particle.scale.x = particle.scale.y = 1 - (frame / life) * 0.5;

                if (frame < life) {
                    requestAnimationFrame(animate);
                } else {
                    container.removeChild(particle);
                }
            };
            animate();
        }
    }

    // 글로우 효과
    createGlowEffect(container, x, y) {
        const glow = new PIXI.Graphics();
        glow.beginFill(0xFFD700, 0.3);
        glow.drawCircle(0, 0, 100);
        glow.endFill();
        glow.x = x;
        glow.y = y;
        glow.scale.set(0);

        container.addChild(glow);

        // 애니메이션
        let scale = 0;
        const animate = () => {
            scale += 0.05;
            glow.scale.set(scale);
            glow.alpha = Math.max(0, 1 - scale * 0.3);

            if (scale < 3) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(glow);
            }
        };
        animate();
    }

    // 콤보 효과
    createComboEffect(container, x, y) {
        const text = new PIXI.Text('COMBO!', {
            fontFamily: 'Pretendard',
            fontSize: 48,
            fontWeight: 'bold',
            fill: ['#FFD700', '#FFA500'],
            stroke: '#000000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowBlur: 4,
            dropShadowDistance: 6
        });

        text.anchor.set(0.5);
        text.x = x;
        text.y = y;
        text.scale.set(0);

        container.addChild(text);

        // 애니메이션
        let scale = 0;
        const animate = () => {
            scale += 0.1;
            text.scale.set(Math.min(scale, 1.5));
            text.rotation = Math.sin(scale * 10) * 0.1;

            if (scale < 1.5) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    let fadeScale = 1.5;
                    const fadeOut = () => {
                        fadeScale += 0.05;
                        text.scale.set(fadeScale);
                        text.alpha = Math.max(0, 1 - (fadeScale - 1.5) * 2);

                        if (text.alpha > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            container.removeChild(text);
                        }
                    };
                    fadeOut();
                }, 500);
            }
        };
        animate();
    }

    // 크리티컬 효과
    createCriticalEffect(container, x, y) {
        const slash = new PIXI.Graphics();
        slash.lineStyle(5, 0xFF0000, 1);
        slash.moveTo(-50, -50);
        slash.lineTo(50, 50);
        slash.x = x;
        slash.y = y;

        container.addChild(slash);

        // 플래시 효과
        const flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF, 0.8);
        flash.drawRect(0, 0, window.innerWidth, window.innerHeight);
        flash.endFill();

        container.addChild(flash);

        // 애니메이션
        let alpha = 0.8;
        const animate = () => {
            alpha -= 0.05;
            flash.alpha = Math.max(0, alpha);

            if (alpha > 0) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(flash);
                setTimeout(() => container.removeChild(slash), 500);
            }
        };
        animate();
    }

    // 화면 전체 효과
    screenShake(intensity = 5, duration = 300) {
        if (!this.app) return;

        const startTime = Date.now();
        const originalX = this.app.view.style.left;
        const originalY = this.app.view.style.top;

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                this.app.view.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                this.app.view.style.transform = '';
            }
        };
        shake();
    }

    // 보스 등장 효과
    bossAppearEffect() {
        if (!this.app) return;

        // 어두운 오버레이
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        overlay.alpha = 0;

        this.app.stage.addChild(overlay);

        // 페이드인
        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.02;
            overlay.alpha = Math.min(alpha, 0.7);

            if (alpha < 0.7) {
                requestAnimationFrame(fadeIn);
            } else {
                // 번개 효과
                this.createLightningEffect();

                // 페이드아웃
                setTimeout(() => {
                    const fadeOut = () => {
                        alpha -= 0.02;
                        overlay.alpha = Math.max(0, alpha);

                        if (alpha > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            this.app.stage.removeChild(overlay);
                        }
                    };
                    fadeOut();
                }, 1000);
            }
        };
        fadeIn();
    }

    // 번개 효과
    createLightningEffect() {
        const lightning = new PIXI.Graphics();
        lightning.lineStyle(3, 0xFFFFFF, 1);

        // 랜덤한 번개 경로 생성
        let x = window.innerWidth / 2;
        let y = 0;
        lightning.moveTo(x, y);

        for (let i = 0; i < 10; i++) {
            y += window.innerHeight / 10;
            x += (Math.random() - 0.5) * 100;
            lightning.lineTo(x, y);
        }

        this.app.stage.addChild(lightning);

        // 플래시와 함께 사라짐
        setTimeout(() => {
            this.app.stage.removeChild(lightning);
        }, 100);
    }
}

// 전역 인스턴스 생성
window.visualEffects = new VisualEffectsManager();

// 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.visualEffects.init();
    });
} else {
    window.visualEffects.init();
}