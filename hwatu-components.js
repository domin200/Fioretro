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
        // 기존 메시지 팝업 컨테이너가 있으면 제거
        const existingContainer = document.querySelector('.message-popup-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };

        // 컨테이너 생성 (위치 고정용)
        const container = DOMUtils.createElement('div', {
            className: 'message-popup-container',
            style: {
                position: 'fixed',
                top: '20px',
                left: '0',
                right: '0',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 99999,
                pointerEvents: 'none'
            }
        });

        const messageDiv = DOMUtils.createElement('div', {
            className: `message-popup message-${type}`,
            style: {
                background: colors[type],
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                animation: 'slideDown 0.3s ease',
                display: 'inline-block'
            },
            textContent: message
        });

        container.appendChild(messageDiv);
        document.body.appendChild(container);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (container && container.parentNode) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }
}

// 카드 선택 컴포넌트
// 보주 아이템용 카드 선택 컴포넌트
class OrbCardSelectionComponent {
    static create(cards, options = {}) {
        
        const {
            title = '카드 선택',
            description = '카드를 선택하세요',
            onSelect = null,
            onCancel = null,
            maxCards = 5,
            showEnhancement = true,
            itemIcon = ''
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
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(5px)',
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
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '25px',
                padding: '35px',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
                maxWidth: '850px',
                width: '90%',
                border: '2px solid rgba(255, 215, 0, 0.3)'
            }
        });

        // 헤더
        const header = DOMUtils.createElement('div', {
            style: {
                textAlign: 'center',
                marginBottom: '25px'
            },
            innerHTML: `
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px;">
                    ${itemIcon ? `<span style="font-size: 28px;">${itemIcon}</span>` : ''}
                    <h2 style="color: #ffd700; margin: 0; font-size: 28px; text-shadow: 0 0 10px rgba(255,215,0,0.5);">${title}</h2>
                </div>
                <p style="color: #fff; margin: 0; opacity: 0.95; font-size: 16px;">${description}</p>
            `
        });

        // 카드 그리드
        const grid = DOMUtils.createElement('div', {
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(displayCards.length, 5)}, 1fr)`,
                gap: '20px',
                marginBottom: '25px',
                padding: '10px'
            }
        });

        // 선택된 카드 추적
        let selectedCard = null;
        let selectedElement = null;

        // 적용 버튼 생성
        const applyBtn = DOMUtils.createElement('button', {
            textContent: '적용',
            disabled: true,
            style: {
                padding: '12px 40px',
                background: 'linear-gradient(135deg, #555 0%, #333 100%)',
                color: '#888',
                border: '2px solid #444',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }
        });

        // 적용 버튼 클릭 이벤트
        applyBtn.onclick = () => {
            if (selectedCard && onSelect) {
                onSelect(selectedCard);
                overlay.remove();
            }
        };

        // 카드 생성
        displayCards.forEach((card, index) => {
            const cardContainer = this.createCardElement(card, {
                index,
                showEnhancement,
                onSelect: (cardEl) => {
                    // 이전 선택 해제
                    if (selectedElement) {
                        selectedElement.classList.remove('selected');
                        selectedElement.style.transform = '';
                        selectedElement.style.border = '';
                        selectedElement.style.boxShadow = '';
                    }
                    
                    // 새 카드 선택
                    selectedCard = card;
                    selectedElement = cardEl;
                    cardEl.classList.add('selected');
                    cardEl.style.transform = 'scale(1.15) translateY(-10px)';
                    cardEl.style.border = '3px solid #ffd700';
                    cardEl.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), 0 10px 30px rgba(0,0,0,0.5)';
                    
                    // 적용 버튼 활성화
                    applyBtn.disabled = false;
                    applyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                    applyBtn.style.color = 'white';
                    applyBtn.style.border = '2px solid #4CAF50';
                    applyBtn.style.cursor = 'pointer';
                    applyBtn.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                }
            });

            grid.appendChild(cardContainer);
        });

        // 버튼 영역
        const buttonArea = DOMUtils.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
            }
        });

        buttonArea.appendChild(applyBtn);

        // 조립
        container.appendChild(header);
        container.appendChild(grid);
        container.appendChild(buttonArea);
        overlay.appendChild(container);

        // 애니메이션 효과
        setTimeout(() => {
            container.style.animation = 'slideIn 0.3s ease';
        }, 50);

        document.body.appendChild(overlay);
        return overlay;
    }

    static createCardElement(card, options) {
        const { index, showEnhancement, onSelect } = options;

        const cardElement = DOMUtils.createElement('div', {
            className: 'orb-selection-card',
            style: {
                width: '120px',
                height: '160px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                transform: 'scale(0)',
                animation: `cardAppear 0.4s ${index * 0.05}s ease forwards`
            }
        });

        // createCardElement 함수 사용 (손패와 동일한 강화 효과 포함)
        if (typeof window.createCardElement === 'function') {
            const generatedCard = window.createCardElement(card);
            generatedCard.style.width = '100%';
            generatedCard.style.height = '100%';
            generatedCard.style.margin = '0';
            generatedCard.style.borderRadius = '10px';
            // 강화 효과와 툴팁은 createCardElement에서 이미 적용됨
            cardElement.appendChild(generatedCard);
        } else {
            // 폴백: 직접 카드 이미지 생성
            cardElement.style.background = `url('cards/${card.id}.svg') center/cover`;
            
            // 카드 정보 오버레이
            const infoOverlay = DOMUtils.createElement('div', {
                style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '10px 5px 5px',
                    borderRadius: '0 0 10px 10px',
                    color: 'white',
                    fontSize: '11px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                },
                innerHTML: `${card.month}월 ${card.name}`
            });
            cardElement.appendChild(infoOverlay);
            
            // 강화 효과 표시 (손패와 동일한 스타일)
            if (showEnhancement && gameStateManager.state.cardEnhancements[card.id]) {
                const enhanceType = gameStateManager.state.cardEnhancements[card.id];
                
                // 강화 클래스 추가
                cardElement.classList.add(`enhanced-${enhanceType.toLowerCase()}`);
                
                // 강화 데이터 속성 추가
                const enhancement = ENHANCEMENT_TYPES[
                    Object.keys(ENHANCEMENT_TYPES).find(key => 
                        ENHANCEMENT_TYPES[key].name === enhanceType
                    )
                ];
                
                if (enhancement) {
                    cardElement.setAttribute('data-enhancement', enhanceType);
                    cardElement.setAttribute('data-enhancement-effect', enhancement.effect);
                }
            }
        }

        // 호버 효과
        cardElement.onmouseenter = () => {
            if (!cardElement.classList.contains('selected')) {
                cardElement.style.transform = 'scale(1.08) translateY(-5px)';
                cardElement.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
            }
        };

        cardElement.onmouseleave = () => {
            if (!cardElement.classList.contains('selected')) {
                cardElement.style.transform = 'scale(1)';
                cardElement.style.boxShadow = '';
            }
        };

        // 클릭 이벤트
        cardElement.onclick = () => onSelect(cardElement);

        return cardElement;
    }
}

// 기존 CardSelectionComponent는 유지 (다른 용도로 사용 중일 수 있음)
class CardSelectionComponent {
    static create(cards, options = {}) {
        // 보주 아이템인 경우 새로운 컴포넌트 사용 (isOrbItem이 명시적으로 true인 경우)
        if (options.isOrbItem === true) {
            return OrbCardSelectionComponent.create(cards, options);
        }

        
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

        // 선택된 카드 추적
        let selectedCard = null;
        let selectedWrapper = null;

        // 적용 버튼 먼저 생성 (나중에 참조하기 위해)
        const applyBtn = DOMUtils.createElement('button', {
            id: 'apply-btn',
            textContent: '적용',
            disabled: true,
            style: {
                padding: '10px 30px',
                background: 'linear-gradient(135deg, #666 0%, #444 100%)',
                color: '#999',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'not-allowed',
                transition: 'all 0.3s ease'
            }
        });

        // 적용 버튼 클릭 이벤트
        applyBtn.onclick = () => {
            if (selectedCard && onSelect) {
                onSelect(selectedCard);
                overlay.remove();
            }
        };

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

            // 카드 이미지 생성 - createCardElement가 있으면 사용, 없으면 기본 카드
            let cardElement;
            if (typeof createCardElement === 'function') {
                cardElement = createCardElement(card);
                cardElement.style.width = '100px';
                cardElement.style.height = '140px';
            } else {
                // 기본 카드 생성
                cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.style.cssText = `
                    width: 100px;
                    height: 140px;
                    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: #333;
                `;
                cardElement.innerHTML = `${card.month}월<br>${card.name}`;
            }
            
            cardWrapper.appendChild(cardElement);

            // 호버 효과
            cardWrapper.onmouseenter = () => {
                if (selectedWrapper !== cardWrapper) {
                    cardWrapper.style.transform = 'translateY(-10px) scale(1.05)';
                }
            };
            cardWrapper.onmouseleave = () => {
                if (selectedWrapper !== cardWrapper) {
                    cardWrapper.style.transform = '';
                }
            };

            // 클릭 이벤트 - 카드 선택만 하고 바로 적용하지 않음
            cardWrapper.onclick = () => {
                // 이전 선택 해제
                if (selectedWrapper) {
                    selectedWrapper.style.transform = '';
                    const prevCard = selectedWrapper.querySelector('.card');
                    if (prevCard) {
                        prevCard.style.border = '';
                        prevCard.style.boxShadow = '';
                    }
                }
                
                // 새 카드 선택
                selectedCard = card;
                selectedWrapper = cardWrapper;
                cardWrapper.style.transform = 'scale(1.1)';
                
                // 카드 엘리먼트에 테두리 적용
                if (cardElement) {
                    cardElement.style.border = '3px solid #ffd700';
                    cardElement.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
                }
                
                // 적용 버튼 활성화
                if (applyBtn) {
                    applyBtn.disabled = false;
                    applyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                    applyBtn.style.color = 'white';
                    applyBtn.style.cursor = 'pointer';
                }
            };

            grid.appendChild(cardWrapper);
        });

        // 버튼 영역
        const buttonArea = DOMUtils.createElement('div', {
            style: {
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
            }
        });

        // 적용 버튼 추가
        buttonArea.appendChild(applyBtn);

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