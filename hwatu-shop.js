// ============================================
// 주막 상점 관리 모듈
// ============================================

class ShopManager {
    constructor() {
        this.items = this.initializeItems();
    }

    initializeItems() {
        return [
            // 보물 (Treasures)
            {
                id: 'hand_size',
                name: '황금 파우치',
                category: 'treasure',
                description: '핸드 크기 +2',
                price: 15,
                rarity: 'legendary',
                icon: '👛',
                effect: () => {
                    gameStateManager.state.handSize += 2;
                    PopupComponent.showMessage('핸드 크기가 2 증가했습니다!', 'success');
                }
            },
            {
                id: 'target_score',
                name: '은빛 목표',
                category: 'treasure',
                description: '목표 점수 -5',
                price: 12,
                rarity: 'epic',
                icon: '🎯',
                effect: () => {
                    gameStateManager.state.targetScore = Math.max(10, gameStateManager.state.targetScore - 5);
                    PopupComponent.showMessage('목표 점수가 5 감소했습니다!', 'success');
                }
            },
            // 보주 (Orbs)
            {
                id: 'blue_orb',
                name: '청룡의 보주',
                category: 'orb',
                description: '선택한 카드에 청 강화 부여 (점수 +1)',
                price: 8,
                rarity: 'rare',
                icon: '🔵',
                enhancementType: ENHANCEMENT_TYPES.BLUE.name,
                requiresCardSelection: true
            },
            {
                id: 'red_orb',
                name: '주작의 보주',
                category: 'orb',
                description: '선택한 카드에 적 강화 부여 (버려질 때 배수 +0.5)',
                price: 10,
                rarity: 'rare',
                icon: '🔴',
                enhancementType: ENHANCEMENT_TYPES.RED.name,
                requiresCardSelection: true
            },
            {
                id: 'white_orb',
                name: '백호의 보주',
                category: 'orb',
                description: '선택한 카드에 백 강화 부여 (바닥에 있을 때 점수 +2)',
                price: 9,
                rarity: 'rare',
                icon: '⚪',
                enhancementType: ENHANCEMENT_TYPES.WHITE.name,
                requiresCardSelection: true
            },
            {
                id: 'black_orb',
                name: '현무의 보주',
                category: 'orb',
                description: '선택한 카드에 흑 강화 부여 (핸드에 있을 때 점수 +2)',
                price: 9,
                rarity: 'epic',
                icon: '⚫',
                enhancementType: ENHANCEMENT_TYPES.BLACK.name,
                requiresCardSelection: true
            },
            {
                id: 'gold_orb',
                name: '황금의 보주',
                category: 'orb',
                description: '선택한 카드에 황 강화 부여 (스테이지 종료 시 소지금 +1)',
                price: 12,
                rarity: 'legendary',
                icon: '🟡',
                enhancementType: ENHANCEMENT_TYPES.GOLD.name,
                requiresCardSelection: true
            },
            {
                id: 'rainbow_orb',
                name: '오색의 보주',
                category: 'orb',
                description: '선택한 카드에 무작위 강화 부여',
                price: 6,
                rarity: 'common',
                icon: '🌈',
                requiresCardSelection: true,
                effect: (card) => {
                    const types = Object.keys(ENHANCEMENT_TYPES);
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    gameStateManager.applyEnhancement(card.id, ENHANCEMENT_TYPES[randomType].name);
                    PopupComponent.showMessage(
                        `${card.name}에 ${ENHANCEMENT_TYPES[randomType].name} 강화가 부여되었습니다!`, 
                        'success'
                    );
                }
            },
            {
                id: 'void_orb',
                name: '무극의 보주',
                category: 'orb',
                description: '선택한 카드를 덱에서 제거',
                price: 5,
                rarity: 'common',
                icon: '🕳️',
                requiresCardSelection: true,
                requiresDeckCard: true,
                effect: (card) => {
                    gameStateManager.removeCard(card.id);
                    PopupComponent.showMessage(`${card.name}가 덱에서 제거되었습니다!`, 'success');
                }
            },
            {
                id: 'twin_orb',
                name: '쌍생의 보주',
                category: 'orb',
                description: '무작위 패 5장 중 하나를 선택해서 복제',
                price: 7,
                rarity: 'epic',
                icon: '🔁',
                requiresRandomHandSelection: true,
                effect: (card) => {
                    gameStateManager.duplicateCard(card.id);
                    
                    // 원본 카드의 강화 효과도 복제
                    const originalEnhancement = gameStateManager.state.cardEnhancements[card.id];
                    if (originalEnhancement) {
                        // 복제된 카드의 ID 생성 (원본과 동일한 ID를 사용)
                        gameStateManager.state.cardEnhancements[card.id] = originalEnhancement;
                        PopupComponent.showMessage(
                            `${card.name}가 ${originalEnhancement} 강화 효과와 함께 복제되었습니다!`, 
                            'success'
                        );
                    } else {
                        PopupComponent.showMessage(`${card.name}가 복제되어 덱에 추가되었습니다!`, 'success');
                    }
                }
            }
        ];
    }

    // 상점 아이템 배치 (2-3 레이아웃)
    arrangeShopItems() {
        const treasures = this.items.filter(item => item.category === 'treasure');
        const orbs = this.items.filter(item => item.category === 'orb');
        
        return {
            topRow: treasures,  // 2개
            bottomRow: orbs.slice(0, 3),  // 3개
            additionalOrbs: orbs.slice(3)  // 나머지
        };
    }

    // 아이템 구매 가능 여부
    canPurchase(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item && 
               gameStateManager.state.gold >= item.price && 
               !gameStateManager.state.purchasedItems.has(itemId);
    }

    // 아이템 구매 처리
    purchaseItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !this.canPurchase(itemId)) return false;

        gameStateManager.updateGold(-item.price);
        gameStateManager.purchaseItem(itemId);

        // 카드 선택이 필요한 경우
        if (item.requiresCardSelection || item.requiresDeckCard || item.requiresRandomHandSelection) {
            return this.handleCardSelection(item);
        }

        // 즉시 효과 적용
        if (item.effect) {
            item.effect();
        }

        return true;
    }

    // 카드 선택 처리
    handleCardSelection(item) {
        if (item.requiresRandomHandSelection) {
            // 무작위 5장 선택
            const allCards = this.getAllDeckCards();
            const randomCards = ArrayUtils.randomSelect(allCards, 5);
            this.showCardSelectionPopup(randomCards, item);
        } else if (item.requiresDeckCard) {
            // 덱 카드 선택
            const deckCards = this.getAllDeckCards();
            this.showCardSelectionPopup(deckCards, item);
        } else {
            // 현재 패 카드 선택
            this.showCardSelectionPopup(gameStateManager.state.playerHand, item);
        }
        return true;
    }

    // 모든 덱 카드 가져오기
    getAllDeckCards() {
        const cards = [];
        for (let month = 1; month <= 12; month++) {
            for (let i = 0; i < 4; i++) {
                const cardId = `${month}_${i + 1}`;
                if (!gameStateManager.state.removedCards.has(cardId)) {
                    cards.push(hwatu[month - 1][i]);
                }
            }
        }
        
        // 복제된 카드 추가
        gameStateManager.state.duplicatedCards.forEach(cardId => {
            const [month, num] = cardId.split('_').map(Number);
            cards.push(hwatu[month - 1][num - 1]);
        });
        
        return cards;
    }

    // 카드 선택 팝업 표시
    showCardSelectionPopup(cards, item) {
        const content = `
            <div class="card-selection-container">
                <p style="color: #ffd700; margin-bottom: 20px;">${item.description}</p>
                <div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
                    ${cards.map(card => `
                        <div class="selectable-card" data-card-id="${card.id}" 
                             style="cursor: pointer; transition: transform 0.3s;">
                            ${CardComponent.create(card, { size: 'small', showEnhancement: true }).outerHTML}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const popup = PopupComponent.create('카드 선택', content, {
            buttons: [
                {
                    text: '취소',
                    type: 'danger',
                    onClick: () => {
                        gameStateManager.updateGold(item.price); // 환불
                        gameStateManager.state.purchasedItems.delete(item.id);
                        PopupComponent.showMessage('구매가 취소되었습니다.', 'info');
                    }
                }
            ]
        });

        // 카드 클릭 이벤트
        popup.querySelectorAll('.selectable-card').forEach(cardDiv => {
            cardDiv.onclick = () => {
                const cardId = cardDiv.dataset.cardId;
                const selectedCard = cards.find(c => c.id === cardId);
                
                if (item.enhancementType) {
                    gameStateManager.applyEnhancement(cardId, item.enhancementType);
                    PopupComponent.showMessage(
                        `${selectedCard.name}에 ${item.enhancementType} 강화가 부여되었습니다!`, 
                        'success'
                    );
                } else if (item.effect) {
                    item.effect(selectedCard);
                }
                
                popup.remove();
            };
        });
    }
}

// 전역 상점 매니저 인스턴스
const shopManager = new ShopManager();