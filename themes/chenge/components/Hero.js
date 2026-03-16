// import Image from 'next/image'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'
import { useGlobal } from '@/lib/global'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

let wrapperTop = 0

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()
  const showWaves = siteConfig('HEXO_HOME_WAVES', false, CONFIG)
  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
  }
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',')
  useEffect(() => {
    updateHeaderHeight()

    if (!typed && window && document.getElementById('typed')) {
      loadExternalResource('/js/typed.min.js', 'js').then(() => {
        if (window.Typed) {
          const typedInstance = new window.Typed('#typed', {
            strings: GREETING_WORDS,
            typeSpeed: 200,
            backSpeed: 100,
            backDelay: 400,
            showCursor: true,
            smartBackspace: true,
            onComplete: () => {
              const typedElement = document.getElementById('typed')
              if (typedElement) {
                if (!window.hitokotoFetched) {
                  window.hitokotoFetched = true
                  setTimeout(() => {
                    fetch('https://v1.hitokoto.cn/?c=d&c=h&c=i&c=j&c=k')
                      .then(response => response.json())
                      .then(data => {
                        typedElement.classList.add(
                          'opacity-0',
                          'transition-opacity',
                          'duration-500'
                        )
                        setTimeout(() => {
                          typedElement.innerHTML = `『 ${data.hitokoto}』—— ${data.from}`
                          typedElement.classList.remove('opacity-0')
                          typedElement.classList.add('opacity-100')
                          window.hitokotoFetched = false
                        }, 500)
                      })
                      .catch(error => {
                        console.error('Fetching Hitokoto failed:', error)
                        window.hitokotoFetched = false
                      })
                  }, 2000)
                }
              }
            }
          })
          changeType(typedInstance)
        }
      })
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
        <header id="header" className="w-full relative bg-black z-1 h-[50vh] min-h-[25rem] min-w-[25rem] flex flex-col justify-center items-center">
          <div className="text-white flex flex-col items-center justify-center z-10">
            {/* 站点标题 */}
            <div className='py-5 font-black text-4xl md:text-5xl shadow-text'>{siteConfig('TITLE')}</div>
            {/* 站点欢迎语 */}
            <div className='h-12 items-center text-center font-medium shadow-text text-lg font-serif'>
                <span id='typed' />
            </div>

            {/* 首页导航大按钮 */}
            {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && <NavButtonGroup {...props} />}

            {/* 滚动按钮 */}
            <div onClick={scrollToWrapper} className="z-10 cursor-pointer text-center py-4 text-3xl text-white">
                <div className="opacity-70 animate-bounce font-semibold text-sm">{siteConfig('HEXO_SHOW_START_READING', null, CONFIG) && locale.COMMON.START_READING}</div>
                <i className='opacity-70 animate-bounce fas fa-angle-down' />
            </div>
          </div>

          {/* 波浪效果 */}
          <div id="waves" className="absolute bottom-0 w-full z-10">
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" />
                <use xlinkHref="#gentle-wave" x="48" y="3" />
                <use xlinkHref="#gentle-wave" x="48" y="5" />
                <use xlinkHref="#gentle-wave" x="48" y="7" />
              </g>
            </svg>
          </div>

          <LazyImage id='header-cover' src={siteInfo?.pageCover}
              className={`header-cover w-full h-screen min-h-[25rem] object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed left-0 z-1' : ''}`} />
          <div id = 'header-cover' className='bg-black bg-opacity-20 absolute top-0 w-full h-full py-10' />
          
        </header>
  )
}

export default Hero
