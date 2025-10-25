// 全局变量
let packetCount = 0;
let totalAmount = 0;
let remainingAmount = 0;
let packets = [];
let claimedPackets = []; // 记录被领取的红包索引，保持原始顺序
let startTime = 0;
let endTime = 0;

// 获取DOM元素
const initScreen = document.getElementById('initScreen');
const packetCountInput = document.getElementById('packetCount');
const totalAmountInput = document.getElementById('totalAmount');
const createPacketButton = document.getElementById('createPacketButton');
const packetListScreen = document.getElementById('packetListScreen');
const remainingCount = document.getElementById('remainingCount');
const totalAmountDisplay = document.getElementById('totalAmountDisplay');
const redPacketGrid = document.getElementById('redPacketGrid');
const packetDetailScreen = document.getElementById('packetDetailScreen');
const backButton = document.getElementById('backButton');
const singleRedPacket = document.getElementById('singleRedPacket');
const singleCoins = document.getElementById('singleCoins');
const packetIndex = document.getElementById('packetIndex');
const singleResultModal = document.getElementById('singleResultModal');
const singleAmountDisplay = document.getElementById('singleAmountDisplay');
const continueButton = document.getElementById('continueButton');
const statsModal = document.getElementById('statsModal');
const statsSummary = document.getElementById('statsSummary');
const amountList = document.getElementById('amountList');
const bestAmount = document.getElementById('bestAmount');
const worstAmount = document.getElementById('worstAmount');
const restartButton = document.getElementById('restartButton');

// 当前选中的红包索引
let currentPacketIndex = -1;

// 生成红包金额数组（公平算法）
function generatePackets(count, amount) {
  const packets = [];
  let remainingAmount = amount * 100; // 转换为分进行计算
  const minAmount = 1; // 最小金额1分
  
  // 为前count-1个红包生成随机金额
  for (let i = 0; i < count - 1; i++) {
    // 确保每个红包至少有1分，且剩余金额也能保证其他红包有1分
    const maxPossible = remainingAmount - (count - i - 1) * minAmount;
    // 生成一个0到maxPossible之间的随机数，但增加一些随机性
    const randomAmount = Math.floor(Math.random() * maxPossible * 0.8) + minAmount;
    packets.push(randomAmount / 100); // 转换回元
    remainingAmount -= randomAmount;
  }
  
  // 最后一个红包拿走剩下的所有金额
  packets.push(remainingAmount / 100);
  
  // 打乱顺序
  return shuffleArray(packets);
}

// 洗牌算法，随机打乱数组
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 创建金币元素
function createCoins(container) {
  // 清空现有金币
  container.innerHTML = '';
  
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
    
    container.appendChild(coin);
  }
}

// 显示红包列表
function showPacketList() {
  redPacketGrid.innerHTML = '';
  
  for (let i = 0; i < packets.length; i++) {
    // 检查是否已领取
    if (claimedPackets.includes(i)) {
      continue;
    }
    
    const packetElement = document.createElement('div');
    packetElement.className = 'relative aspect-square cursor-pointer hover:scale-105 transition-transform';
    packetElement.innerHTML = `
      <div class="w-full h-full bg-red-primary rounded-xl red-packet-shadow relative overflow-hidden flex flex-col items-center justify-center">
        <div class="absolute top-1/4 left-0 right-0 h-[1px] bg-gold-primary"></div>
        <div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gold-primary"></div>
        <div class="text-gold-primary text-sm font-bold mt-4 mb-1">红包</div>
        <div class="text-gold-light text-xs">点击领取</div>
        <div class="absolute bottom-0 left-0 right-0 h-3 bg-red-dark"></div>
      </div>
    `;
    
    packetElement.addEventListener('click', () => {
      openPacketDetail(i);
    });
    
    redPacketGrid.appendChild(packetElement);
  }
  
  remainingCount.textContent = packets.length - claimedPackets.length;
  totalAmountDisplay.textContent = `¥${totalAmount.toFixed(2)}`;
}

// 打开红包详情页面
function openPacketDetail(index) {
  currentPacketIndex = index;
  packetIndex.textContent = `第${index + 1}个`;
  
  // 重置红包状态
  singleRedPacket.classList.remove('open-animation');
  singleRedPacket.style.pointerEvents = 'auto';
  singleCoins.classList.add('hidden');
  
  // 切换页面
  packetListScreen.classList.add('hidden');
  packetDetailScreen.classList.remove('hidden');
}

// 拆红包流程
function claimPacket() {
  // 防止重复点击
  singleRedPacket.style.pointerEvents = 'none';
  
  // 显示金币容器
  singleCoins.classList.remove('hidden');
  
  // 创建金币并执行动画
  createCoins(singleCoins);
  
  // 执行红包打开动画
  singleRedPacket.classList.add('open-animation');
  
  // 动画结束后显示结果
  setTimeout(() => {
    const amount = packets[currentPacketIndex];
    singleAmountDisplay.textContent = `¥${amount.toFixed(2)}`;
    singleResultModal.classList.remove('hidden');
    
    // 记录被领取的红包索引
    claimedPackets.push(currentPacketIndex);
    
    // 检查是否是第一次领取
    if (claimedPackets.length === 1) {
      startTime = Date.now();
    }
    
    // 检查是否所有红包都已领取
    if (claimedPackets.length === packets.length) {
      endTime = Date.now();
      showStats();
      // 延迟显示统计结果，让用户先看到单个红包结果
      setTimeout(() => {
        statsModal.classList.remove('hidden');
      }, 1500);
    }
  }, 800);
}

// 显示统计结果
function showStats() {
  const timeTaken = Math.round((endTime - startTime) / 1000); // 转换为秒
  
  // 更新统计摘要
  statsSummary.textContent = `共${packets.length}个红包，总计¥${totalAmount.toFixed(2)}，${timeTaken}秒被抢完`;
  
  // 获取手气最佳和最差金额
  const best = Math.max(...packets);
  const worst = Math.min(...packets);
  
  // 更新手气最佳和最差
  bestAmount.textContent = `¥${best.toFixed(2)}`;
  worstAmount.textContent = `¥${worst.toFixed(2)}`;
  
  // 更新金额列表 - 严格按照红包的原始序号（1,2,3...）显示
  amountList.innerHTML = '';
  
  // 创建一个包含所有红包信息的数组
  const allPacketsInfo = packets.map((amount, index) => ({
    index: index,
    amount: amount,
    isClaimed: claimedPackets.includes(index)
  }));
  
  // 按照红包的原始索引排序，确保顺序是1、2、3...
  allPacketsInfo.sort((a, b) => a.index - b.index);
  
  allPacketsInfo.forEach(info => {
    const isBest = info.amount === best;
    const isWorst = info.amount === worst && !isBest; // 避免在所有金额相同时重复标记
    
    const listItem = document.createElement('div');
    listItem.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
    
    let label = `第${info.index + 1}个`;
    if (isBest) {
      label += ' <span class="text-amber-500">🏆 手气最佳</span>';
    } else if (isWorst) {
      label += ' <span class="text-gray-500">💩 运气最差</span>';
    }
    
    listItem.innerHTML = `
      <span>${label}</span>
      <span class="font-bold text-red-primary">¥${info.amount.toFixed(2)}</span>
    `;
    
    amountList.appendChild(listItem);
  });
}

// 返回红包列表
function goBackToList() {
  packetDetailScreen.classList.add('hidden');
  packetListScreen.classList.remove('hidden');
  showPacketList();
}

// 继续抢红包
function continueClaiming() {
  singleResultModal.classList.add('hidden');
  goBackToList();
}

// 重新开始
function restartGame() {
  statsModal.classList.add('hidden');
  singleResultModal.classList.add('hidden');
  packetListScreen.classList.add('hidden');
  packetDetailScreen.classList.add('hidden');
  initScreen.classList.remove('hidden');
  
  // 重置变量
  packets = [];
  claimedPackets = []; // 重置已领取红包记录
  currentPacketIndex = -1;
}

// 初始化红包
function initPackets() {
  packetCount = parseInt(packetCountInput.value);
  totalAmount = parseFloat(totalAmountInput.value);
  
  // 验证输入
  if (isNaN(packetCount) || packetCount < 1 || packetCount > 100) {
    alert('请输入1-100之间的红包个数');
    return;
  }
  
  if (isNaN(totalAmount) || totalAmount < 0.01 || totalAmount < packetCount * 0.01) {
    alert('请输入足够的总金额（至少红包个数×0.01元）');
    return;
  }
  
  // 生成红包金额
  packets = generatePackets(packetCount, totalAmount);
  claimedPackets = [];
  
  // 切换到红包列表页面
  initScreen.classList.add('hidden');
  packetListScreen.classList.remove('hidden');
  showPacketList();
}

// 事件监听
createPacketButton.addEventListener('click', initPackets);
backButton.addEventListener('click', goBackToList);
singleRedPacket.addEventListener('click', claimPacket);
continueButton.addEventListener('click', continueClaiming);
restartButton.addEventListener('click', restartGame);