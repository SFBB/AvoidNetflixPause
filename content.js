/**
 * Netflix Auto-Resume Content Script (Manifest V3)
 * 1. 定期模拟鼠标活动以防止闲置对话框弹出
 * 2. 如果对话框已弹出，则模拟真实的鼠标点击事件关闭它
 */

(function() {
  'use strict';

  const SELECTORS = [
    'button[aria-label="Continue Watching"]',
    'button[aria-label="Keep Watching"]',
    '.postplay-still-watching-button',
    '[data-uia="interrupt-autocomplete-continue"]'
  ];

  /**
   * 模拟鼠标点击事件
   * 比直接调用 .click() 更接近真实用户操作
   */
  function simulateMouseClick(element) {
    const mouseEvents = ['mousedown', 'mouseup', 'click'];
    mouseEvents.forEach(mouseEventType => {
      element.dispatchEvent(new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      }));
    });
  }

  /**
   * 检查并处理暂停对话框
   */
  function checkAndClick() {
    for (const selector of SELECTORS) {
      const button = document.querySelector(selector);
      if (button && (button.offsetWidth > 0 || button.offsetHeight > 0)) {
        console.log('Netflix Auto-Resume: 发现暂停按钮，模拟点击中...');
        simulateMouseClick(button);
        return true;
      }
    }
    return false;
  }

  /**
   * 模拟微小的鼠标移动以保持活跃状态
   */
  function simulateActivity() {
    const event = new MouseEvent('mousemove', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: Math.floor(Math.random() * window.innerWidth),
      clientY: Math.floor(Math.random() * window.innerHeight)
    });
    document.dispatchEvent(event);
    // console.log('Netflix Auto-Resume: 已发送模拟鼠标移动以保持活跃');
  }

  // 1. 每隔 60 秒模拟一次鼠标活动，防止触发闲置逻辑
  setInterval(simulateActivity, 60000);

  // 2. 使用 MutationObserver 监听 DOM 变化（实时捕获按钮）
  const observer = new MutationObserver(() => {
    checkAndClick();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Netflix Auto-Resume: 增强型（模拟鼠标事件）扩展已启动');
})();