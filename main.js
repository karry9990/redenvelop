// 获取DOM元素
const redPacket = document.getElementById('redPacket');
const coinsContainer = document.getElementById('coins');
const resultModal = document.getElementById('resultModal');
const amountDisplay = document.getElementById('amountDisplay');
const resetButton = document.getElementById('resetButton');

// 生成随机金额（0.01元到200元之间）
function generateRandomAmount() {
  const min = 0.01;
  const max = 200;
  const amount = (Math.random() * (max - min) + min).toFixed(2);
  return amount;
}

// 创建金币元素
function createCoins() {
  // 清空现有金币
  coinsContainer.innerHTML = '';
  
  // 创建10个金币
  for (let i = 0; i < 10; i++) {
    const coin = document.createElement('div');
    
    // 随机位置和大小
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 0.5;
    
    coin.className = 'absolute rounded-full gold-gradient coin-animation flex items-center justify-center';
    coin.style.width = `${size}px`;
    coin.style.height = `${size}px`;
    coin.style.left = `${left}%`;
    coin.style.top = `${top}%`;
    coin.style.animationDelay = `${delay}s`;
    coin.innerHTML = '<i class="fa fa-yen text-xs text-gold-dark"></i>';
    
    coinsContainer.appendChild(coin);
  }
}

// 开红包流程
function openRedPacket() {
  // 防止重复点击
  redPacket.style.pointerEvents = 'none';
  
  // 显示金币容器
  coinsContainer.classList.remove('hidden');
  
  // 创建金币并执行动画
  createCoins();
  
  // 执行红包打开动画
  redPacket.classList.add('open-animation');
  
  // 动画结束后显示结果
  setTimeout(() => {
    const amount = generateRandomAmount();
    amountDisplay.textContent = `¥${amount}`;
    resultModal.classList.remove('hidden');
  }, 800);
}

// 重置红包状态
function resetRedPacket() {
  resultModal.classList.add('hidden');
  coinsContainer.classList.add('hidden');
  redPacket.classList.remove('open-animation');
  redPacket.style.pointerEvents = 'auto';
}

// 事件监听
redPacket.addEventListener('click', openRedPacket);
resetButton.addEventListener('click', resetRedPacket);