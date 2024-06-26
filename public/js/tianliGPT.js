console.log("\n %c Post-Abstract-AI 开源博客文章摘要AI生成工具 %c https://github.com/zhheo/Post-Abstract-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")

function tianliGPT(usePjax) {
  var tianliGPTIsRunning = false;
  var tianliGPT_postSelector = '#notion-article';
  var tianliGPT_key = '633d5445b832cb5d8e59';
  let tianliGPT_wordLimit = 4000;
  let tianliGPT_postURL = ['*/article/*', '*/about*'];
  function insertAIDiv(selector) {
    // 首先移除现有的 "post-TianliGPT" 类元素（如果有的话）
    removeExistingAIDiv();

    // 获取目标元素
    const targetElement = document.querySelector(selector);

    // 如果没有找到目标元素，不执行任何操作
    if (!targetElement) {
      return;
    }

    // 创建要插入的HTML元素
    const aiDiv = document.createElement('div');
    aiDiv.className = 'post-TianliGPT';

    const aiTitleDiv = document.createElement('div');
    aiTitleDiv.className = 'tianliGPT-title';
    aiDiv.appendChild(aiTitleDiv);

    const aiIcon = document.createElement('i');
    aiIcon.className = 'tianliGPT-title-icon';
    aiTitleDiv.appendChild(aiIcon);

    // 插入 SVG 图标
    aiIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48">
    <title>机器人</title>
    <g id="&#x673A;&#x5668;&#x4EBA;" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="&#x5F62;&#x72B6;&#x7ED3;&#x5408;" fill="#444444" fill-rule="nonzero"></path>
    </g>
    </svg>`;

    const aiTitleTextDiv = document.createElement('div');
    aiTitleTextDiv.className = 'tianliGPT-title-text';
    aiTitleTextDiv.textContent = 'AI摘要';
    aiTitleDiv.appendChild(aiTitleTextDiv);

    const aiTagDiv = document.createElement('div');
    aiTagDiv.className = 'tianliGPT-tag';
    aiTagDiv.id = 'tianliGPT-tag';
    aiTagDiv.textContent = 'chengeGPT';
    aiTitleDiv.appendChild(aiTagDiv);

    const aiExplanationDiv = document.createElement('div');
    aiExplanationDiv.className = 'tianliGPT-explanation';
    aiExplanationDiv.innerHTML = '生成中...' + '<span class="blinking-cursor"></span>';
    aiDiv.appendChild(aiExplanationDiv); // 将 tianliGPT-explanation 插入到 aiDiv，而不是 aiTitleDiv

    // 将创建的元素插入到目标元素的顶部
    targetElement.insertBefore(aiDiv, targetElement.firstChild);
  }

  function removeExistingAIDiv() {
    // 查找具有 "post-TianliGPT" 类的元素
    const existingAIDiv = document.querySelector(".post-TianliGPT");

    // 如果找到了这个元素，就从其父元素中删除它
    if (existingAIDiv) {
      existingAIDiv.parentElement.removeChild(existingAIDiv);
    }
  }

  var tianliGPT = {
    //读取文章中的所有文本
    getTitleAndContent : function() {
      try {
        const title = document.title;
        const container = document.querySelector(tianliGPT_postSelector);
        if (!container) {
          console.warn('TianliGPT：找不到文章容器。请尝试将引入的代码放入到文章容器之后。如果本身没有打算使用摘要功能可以忽略此提示。');
          return '';
        }
    
        let content = '';
        
        // 递归函数来遍历并收集所有元素的文本内容，排除指定类名的内容
        const collectTexts = (element) => {
          // 检查是否为需要排除的类名，如果是则返回不再继续遍历其子节点
          if (element.classList.contains('notion-collection-page-properties')) {
            return;
          }
    
          for (let child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
              content += child.textContent + ' ';
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              collectTexts(child); // 递归调用以处理子元素
            }
          }
        };
    
        collectTexts(container);
    
        const combinedText = title + ' ' + content;
        let wordLimit = 1000;
        if (typeof tianliGPT_wordLimit !== "undefined") {
          wordLimit = tianliGPT_wordLimit;
        }
        const truncatedText = combinedText.slice(0, wordLimit);
        return truncatedText;
      } catch (e) {
        console.error('TianliGPT错误：可能由于一个或多个错误导致没有正常运行，原因出在获取文章容器中的内容失败，或者可能是在文章转换过程中失败。', e);
        return '';
      }
    },

    fetchTianliGPT: async function(content) {
      if (!tianliGPT_key) {
        return "没有获取到key，代码可能没有安装正确。如果你需要在tianli_gpt文件引用前定义tianliGPT_key变量。详细请查看文档。";
      }

      if (tianliGPT_key === "5Q5mpqRK5DkwT1X9Gi5e") {
        return "请购买 key 使用，如果你能看到此条内容，则说明代码安装正确。";
      }
      var url = window.location.href;
      const title = document.title;
      const apiUrl = `https://summary.tianli0.top/?content=${encodeURIComponent(content)}&key=${encodeURIComponent(tianliGPT_key)}&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      const timeout = 20000; // 设置超时时间（毫秒）

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          return {
            summary: data.summary,
            audioId: data.id // 获取音频的 ID
          };
        } else {
          if (response.status === 402) {
            document.querySelectorAll('.post-TianliGPT').forEach(el => {
              el.style.display = 'none';
            });
          }
          throw new Error('TianliGPT：余额不足，请充值后请求新的文章');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          if (window.location.hostname === 'localhost') {
            console.warn('警告：请勿在本地主机上测试 API 密钥。');
            return '获取文章摘要超时。请勿在本地主机上测试 API 密钥。';
          } else {
            console.error('请求超时');
            return '获取文章摘要超时。当你出现这个问题时，可能是key或者绑定的域名不正确。也可能是因为文章过长导致的 AI 运算量过大，您可以稍等一下然后刷新页面重试。';
          }
        } else {
          console.error('请求失败：', error);
          return '获取文章摘要失败，请稍后再试。';
        }
      }
    },

    aiShowAnimation: function (text) {
      const element = document.querySelector(".tianliGPT-explanation");
      if (!element) {
        return;
      }

      if (tianliGPTIsRunning) {
        return;
      }

      // 检查用户是否已定义tianliGPT_typingAnimate并且其值为false
      if (typeof tianliGPT_typingAnimate !== "undefined" && !tianliGPT_typingAnimate) {
        // 如果用户已定义tianliGPT_typingAnimate并且其值为false，则立即显示完整文本
        element.innerHTML = text;
        return;
      }

      tianliGPTIsRunning = true;
      const typingDelay = 25;
      const waitingTime = 1000;
      const punctuationDelayMultiplier = 6;

      element.style.display = "block";
      element.innerHTML = "生成中..." + '<span class="blinking-cursor"></span>';

      let animationRunning = true;
      let currentIndex = 0;
      let initialAnimation = true;
      let lastUpdateTime = performance.now();

      const animate = () => {
        if (text && currentIndex < text.length && animationRunning) {
          const currentTime = performance.now();
          const timeDiff = currentTime - lastUpdateTime;

          const letter = text.slice(currentIndex, currentIndex + 1);
          const isPunctuation = /[，。！、？,.!?]/.test(letter);
          const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

          if (timeDiff >= delay) {
            element.innerText = text.slice(0, currentIndex + 1);
            lastUpdateTime = currentTime;
            currentIndex++;

            if (currentIndex < text.length) {
              element.innerHTML =
                text.slice(0, currentIndex) +
                '<span class="blinking-cursor"></span>';
            } else {
              element.innerHTML = text;
              element.style.display = "block";
              tianliGPTIsRunning = false;
              observer.disconnect(); // 暂停监听
            }
          }
          requestAnimationFrame(animate);
        }
      }

      // 使用IntersectionObserver对象优化ai离开视口后暂停的业务逻辑，提高性能
      const observer = new IntersectionObserver((entries) => {
        let isVisible = entries[0].isIntersecting;
        animationRunning = isVisible; // 标志变量更新
        if (animationRunning && initialAnimation) {
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, 200);
        }
      }, { threshold: 0 });
      let post_ai = document.querySelector('.post-TianliGPT');
      observer.observe(post_ai); //启动新监听
    },
  }
  function runTianliGPT() {
    const content = tianliGPT.getTitleAndContent();
    insertAIDiv(tianliGPT_postSelector);
    if (content) {
      console.log('TianliGPT本次提交的内容为：' + content);
    }
    tianliGPT.fetchTianliGPT(content).then(data => {
      const summary = data.summary;
      const audioId = data.audioId;
      const buttonDiv = document.querySelector('.tianliGPT-tag');
      buttonDiv.dataset.audioId = audioId; // 将音频的 ID 存储在按钮的 dataset 属性中
      tianliGPT.aiShowAnimation(summary);
    })
  }

  function checkURLAndRun() {
    if (typeof tianliGPT_postURL === "undefined") {
      runTianliGPT(); // 如果没有设置自定义 URL，则直接执行 runTianliGPT() 函数
      return;
    }

    try {
      const wildcardToRegExp = (s) => {
        return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
      };
    
      const regExpEscape = (s) => {
        return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
      };
    
      // 假设 tianliGPT_postURL 是一个包含多个模式的数组
      const currentURL = window.location.href;
    
      // 检查当前URL是否与数组中的任何一个模式相匹配
      const isURLMatched = tianliGPT_postURL.some(pattern => {
        const urlPattern = wildcardToRegExp(pattern);
        return urlPattern.test(currentURL);
      });
    
      if (isURLMatched) {
        runTianliGPT(); // 如果当前URL符合数组中的任一模式，则执行runTianliGPT()函数
      } else {
        console.log("TianliGPT：因为不符合自定义的链接规则，我决定不执行摘要功能。");
      }
    } catch (error) {
      console.error("TianliGPT：我没有看懂你编写的自定义链接规则，所以我决定不执行摘要功能", error);
    }    
  }

  if (usePjax) {
    checkURLAndRun();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      checkURLAndRun();
    });
  }
}

tianliGPT(true);

document.addEventListener('pjax:complete', function () {
  tianliGPT(true);
})

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('tianliGPT-tag')) {
    playAudio();
  }
});

var audioPlayer = null; // 用于存储音频播放器对象
function playAudio() {
  if (audioPlayer && !audioPlayer.paused) {
    audioPlayer.pause();
  } else {
    if (!audioPlayer) {
      const buttonDiv = document.querySelector('.tianliGPT-tag');
      const audioId = buttonDiv.dataset.audioId;

      if (!audioId) {
        console.error('未找到音频 ID');
        return;
      }

      const audioUrl = `https://summary.tianli0.top/audio?id=${encodeURIComponent(audioId)}&key=${encodeURIComponent(tianliGPT_key)}`;

      audioPlayer = new Audio(audioUrl);
      audioPlayer.addEventListener('ended', () => {
        buttonDiv.classList.remove('playing');
      });

      audioPlayer.addEventListener('play', () => {
        buttonDiv.classList.add('playing');
      });

      audioPlayer.addEventListener('pause', () => {
        buttonDiv.classList.remove('playing');
      });
    }

    setTimeout(() => {
      audioPlayer.play().catch(error => {
        console.error('播放音频失败:', error);
      });
    }, 100); // 添加延迟以确保播放请求能够正常执行
  }

  const buttonDiv = document.querySelector('.tianliGPT-tag');

  buttonDiv.addEventListener('click', function() {
    buttonDiv.classList.toggle('playing');
  });

  const svgAnimation = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1692880829044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2346" data-darkreader-inline-fill="" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M512 1024a512 512 0 1 0 0-1024 512 512 0 1 0 0 1024z m0-704a192 192 0 1 1 0 384 192 192 0 1 1 0-384z" p-id="2347"></path></svg>';

  if (buttonDiv.classList.contains('playing')) {
    buttonDiv.innerHTML = svgAnimation;
    buttonDiv.style.animation = '';
    buttonDiv.style.color = '#ff0000';
    buttonDiv.style.backgroundColor = 'transparent';
    buttonDiv.style.padding = '0';
  } else {
    buttonDiv.innerHTML = svgAnimation;
    buttonDiv.style.animation = '';
    buttonDiv.style.color = '#000000';
    buttonDiv.style.backgroundColor = 'transparent';
    buttonDiv.style.padding = '0';
  }
}


document.addEventListener('click', function (event) {
  const target = event.target;
  const buttonDiv = document.querySelector('.tianliGPT-tag');

  buttonDiv && buttonDiv.addEventListener('click', function() {
    buttonDiv.classList.toggle('playing');
  });

  if (target === buttonDiv || (buttonDiv && buttonDiv.contains(target))) {
    playAudio();
  }
});
