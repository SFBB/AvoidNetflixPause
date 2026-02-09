/**
 * Netflix Auto-Resume Content Script (Manifest V3)
 * 策略：精确点击 + 重复触发保护
 */

(function() {
  'use strict';

  const BUTTON_SELECTORS = [
    '[data-uia="interrupt-autoplay-continue"]',
    'button[aria-label="Continue Watching"]',
    'button[aria-label="Keep Watching"]',
    '.postplay-still-watching-button'
  ];

  let lastClickTime = 0;
  const CLICK_COOLDOWN = 5000; // 5秒冷却时间，防止重复触发

  /**
   * 查找并点击按钮
   */
  function findAndClickButton() {
    const now = Date.now();
    
    // 如果距离上次点击不足 5 秒，则跳过
    if (now - lastClickTime < CLICK_COOLDOWN) return;

    for (const selector of BUTTON_SELECTORS) {
      const button = document.querySelector(selector);
      
      // 检查按钮是否存在、可见，且没有被标记为已点击
      if (button && isVisible(button) && !button.hasAttribute('data-extension-clicked')) {
        
        console.log(`Netflix Auto-Resume: 发现按钮 ${selector}，正在执行点击...`);
        
        // 1. 更新状态防止重复
        lastClickTime = now;
        button.setAttribute('data-extension-clicked', 'true');

        // 2. 模拟点击
        const opts = { bubbles: true, cancelable: true, view: window };
        button.dispatchEvent(new MouseEvent('mousedown', opts));
        button.dispatchEvent(new MouseEvent('mouseup', opts));
        button.click();
        
        // 3. 点击后尝试让按钮失焦，更像真实行为
        button.blur();

        return true; 
      }
    }
  }

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  // --- 自动化触发 ---

  // 使用 MutationObserver 监听
  const observer = new MutationObserver(() => {
    findAndClickButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 每秒保底检查
  setInterval(findAndClickButton, 1000);

  console.log('Netflix Auto-Resume: 保护模式已启动（已添加重复点击拦截）。');
})();
