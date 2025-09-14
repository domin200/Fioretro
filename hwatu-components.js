// ============================================
// UI 컴포넌트
// ============================================

// 카드 컴포넌트
class CardComponent {
    static create(card, options = {}) {
        const {
            size = 'normal',
            clickable = false,
            showEnhancement = true,
            onClick = null
        } = options;

        const cardDiv = DOMUtils.createElement('div', {
            className: `hwatu-card card-${size}`,
            dataset: { 
                month: card.month, 
                type: card.type,
                cardId: card.id 
            }
        });

        // 카드 이미지
        const img = DOMUtils.createElement('img', {
            src: `cards/${card.id}.svg`,
            alt: `${card.month}월 ${card.name}`,
            draggable: false
        });
        cardDiv.appendChild(img);

        // 카드 정보 라벨
        const label = this.createCardLabel(card);
        cardDiv.appendChild(label);

        // 강화 효과 표시
        if (showEnhancement && gameState.cardEnhancements[card.id]) {
            this.addEnhancementEffect(cardDiv, gameState.cardEnhancements[card.id]);
        }

        // 클릭 이벤트
        if (clickable && onClick) {
            cardDiv.style.cursor = 'pointer';
            cardDiv.onclick = () => onClick(card);
        }

        return cardDiv;
    }

    static createCardLabel(card) {
        const labelDiv = DOMUtils.createElement('div', {
            className: 'card-label',
            innerHTML: `
                <div class="animated-gradient-text gradient-${card.type}">
                    <div class="gradient-overlay"></div>
                    <div class="text-content">${card.month}월</div>
                </div>
                <div class="card-name animated-gradient-text gradient-${card.type}">
                    <div class="gradient-overlay"></div>
                    <div class="text-content">${card.name}</div>
                </div>
            `
        });
        return labelDiv;
    }

    static addEnhancementEffect(cardDiv, enhanceType) {
        const enhancement = ENHANCEMENT_TYPES[
            Object.keys(ENHANCEMENT_TYPES).find(key => 
                ENHANCEMENT_TYPES[key].name === enhanceType
            )
        ];

        if (!enhancement) return;

        // 강화 테두리
        cardDiv.style.cssText += `
            border: 2px solid ${enhancement.color};
            box-shadow: 0 0 10px rgba(${enhancement.rgb}, 0.5);
        `;

        // 강화 배지
        const badge = DOMUtils.createElement('div', {
            className: 'enhancement-badge',
            style: {
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: enhancement.color,
                color: enhancement.name === '황' ? '#000' : '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
            },
            textContent: enhanceType
        });
        cardDiv.appendChild(badge);
    }
}

// 버튼 컴포넌트
class ButtonComponent {
    static create(text, options = {}) {
        const {
            type = 'primary',
            size = 'medium',
            gradient = false,
            disabled = false,
            onClick = null
        } = options;

        const buttonStyles = {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            danger: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            warning: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
        };

        const sizeStyles = {
            small: { padding: '5px 15px', fontSize: '14px' },
            medium: { padding: '10px 30px', fontSize: '16px' },
            large: { padding: '15px 40px', fontSize: '20px' }
        };

        const button = DOMUtils.createElement('button', {
            className: `btn btn-${type} btn-${size}`,
            disabled: disabled,
            style: {
                background: gradient ? buttonStyles[type] : '',
                ...sizeStyles[size],
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: disabled ? 0.5 : 1
            },
            textContent: text,
            onclick: onClick
        });

        // 호버 효과
        if (!disabled) {
            button.onmouseover = () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            };
            button.onmouseout = () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            };
        }

        return button;
    }
}

// 팝업 컴포넌트
class PopupComponent {
    static create(title, content, options = {}) {
        const {
            showClose = true,
            buttons = [],
            width = '400px',
            gradient = true
        } = options;

        const overlay = DOMUtils.createElement('div', {
            className: 'popup-overlay',
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
            }
        });

        const popup = DOMUtils.createElement('div', {
            className: 'popup-container',
            style: {
                background: gradient 
                    ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                    : '#fff',
                borderRadius: '20px',
                padding: '30px',
                maxWidth: width,
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }
        });

        // 타이틀
        if (title) {
            const titleElement = DOMUtils.createElement('h2', {
                style: {
                    color: gradient ? '#ffd700' : '#333',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '28px'
                },
                textContent: title
            });
            popup.appendChild(titleElement);
        }

        // 콘텐츠
        const contentElement = DOMUtils.createElement('div', {
            className: 'popup-content',
            innerHTML: content,
            style: {
                color: gradient ? '#fff' : '#333',
                marginBottom: '20px'
            }
        });
        popup.appendChild(contentElement);

        // 버튼들
        if (buttons.length > 0) {
            const buttonContainer = DOMUtils.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center'
                }
            });

            buttons.forEach(buttonConfig => {
                const button = ButtonComponent.create(
                    buttonConfig.text,
                    {
                        ...buttonConfig,
                        onClick: () => {
                            if (buttonConfig.onClick) buttonConfig.onClick();
                            if (buttonConfig.closeOnClick !== false) {
                                overlay.remove();
                            }
                        }
                    }
                );
                buttonContainer.appendChild(button);
            });

            popup.appendChild(buttonContainer);
        }

        // 닫기 버튼
        if (showClose) {
            const closeButton = DOMUtils.createElement('button', {
                className: 'popup-close',
                innerHTML: '×',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: gradient ? '#fff' : '#333',
                    fontSize: '30px',
                    cursor: 'pointer'
                },
                onclick: () => overlay.remove()
            });
            popup.appendChild(closeButton);
        }

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        return overlay;
    }

    static showMessage(message, type = 'info', duration = 3000) {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };

        const messageDiv = DOMUtils.createElement('div', {
            className: `message-popup message-${type}`,
            style: {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: colors[type],
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                zIndex: 10001,
                animation: 'slideDown 0.3s ease'
            },
            textContent: message
        });

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, duration);
    }
}

// 카드 선택 컴포넌트
class CardSelectionComponent {
    static create(cards, options = {}) {
        const {
            title = '카드 선택',
            description = '카드를 선택하세요',
            onSelect = null,
            onCancel = null,
            maxCards = 5,
            showEnhancement = true
        } = options;

        // 최대 카드 수 제한
        const displayCards = cards.slice(0, maxCards);

        // 오버레이 생성
        const overlay = DOMUtils.createElement('div', {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease'
            }
        });

        // 컨테이너 생성
        const container = DOMUtils.createElement('div', {
            style: {
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                maxWidth: '800px',
                width: '90%'
            }
        });

        // 헤더
        const header = DOMUtils.createElement('div', {
            style: {
                textAlign: 'center',
                marginBottom: '20px'
            },
            innerHTML: `
                <h2 style="color: #ffd700; margin: 0 0 10px 0; font-size: 24px;">${title}</h2>
                <p style="color: #fff; margin: 0; opacity: 0.9;">${description}</p>
            `
        });

        // 카드 그리드
        const grid = DOMUtils.createElement('div', {
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(displayCards.length, 5)}, 1fr)`,
                gap: '15px',
                marginBottom: '20px'
            }
        });

        // 카드 생성
        displayCards.forEach(card => {
            const cardWrapper = DOMUtils.createElement('div', {
                className: 'selectable-card-wrapper',
                style: {
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    position: 'relative'
                }
            });

            // CardComponent를 사용하여 카드 생성
            const cardElement = CardComponent.create(card, { 
                size: 'medium', 
                showEnhancement: showEnhancement 
            });
            
            cardWrapper.appendChild(cardElement);

            // 호버 효과
            cardWrapper.onmouseenter = () => {
                cardWrapper.style.transform = 'translateY(-10px) scale(1.05)';
            };
            cardWrapper.onmouseleave = () => {
                cardWrapper.style.transform = '';
            };

            // 클릭 이벤트
            cardWrapper.onclick = () => {
                if (onSelect) {
                    onSelect(card);
                }
                overlay.remove();
            };

            grid.appendChild(cardWrapper);
        });

        // 버튼 영역 (취소 버튼 제거)
        const buttonArea = DOMUtils.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
            }
        });

        // 조립
        container.appendChild(header);
        container.appendChild(grid);
        container.appendChild(buttonArea);
        overlay.appendChild(container);

        document.body.appendChild(overlay);

        return overlay;
    }
}

// 툴팁 컴포넌트
class TooltipComponent {
    static create(targetElement, content, options = {}) {
        const {
            position = 'top',
            showDelay = 0,
            hideDelay = 0
        } = options;

        let tooltip = null;
        let showTimeout = null;
        let hideTimeout = null;

        const show = () => {
            showTimeout = setTimeout(() => {
                const rect = targetElement.getBoundingClientRect();
                
                tooltip = DOMUtils.createElement('div', {
                    className: 'tooltip',
                    innerHTML: content,
                    style: {
                        position: 'fixed',
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        zIndex: 10000,
                        pointerEvents: 'none',
                        maxWidth: '300px'
                    }
                });

                document.body.appendChild(tooltip);

                // 위치 설정
                const tooltipRect = tooltip.getBoundingClientRect();
                const positions = {
                    top: {
                        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
                        top: rect.top - tooltipRect.height - 10
                    },
                    bottom: {
                        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
                        top: rect.bottom + 10
                    },
                    left: {
                        left: rect.left - tooltipRect.width - 10,
                        top: rect.top + rect.height / 2 - tooltipRect.height / 2
                    },
                    right: {
                        left: rect.right + 10,
                        top: rect.top + rect.height / 2 - tooltipRect.height / 2
                    }
                };

                const pos = positions[position];
                tooltip.style.left = `${pos.left}px`;
                tooltip.style.top = `${pos.top}px`;

                AnimationUtils.fadeIn(tooltip, 200);
            }, showDelay);
        };

        const hide = () => {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                if (tooltip) {
                    AnimationUtils.fadeOut(tooltip, 200);
                    setTimeout(() => {
                        if (tooltip) {
                            tooltip.remove();
                            tooltip = null;
                        }
                    }, 200);
                }
            }, hideDelay);
        };

        targetElement.addEventListener('mouseenter', show);
        targetElement.addEventListener('mouseleave', hide);

        return {
            destroy: () => {
                targetElement.removeEventListener('mouseenter', show);
                targetElement.removeEventListener('mouseleave', hide);
                if (tooltip) tooltip.remove();
            }
        };
    }
}