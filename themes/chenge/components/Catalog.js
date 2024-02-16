import { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import Progress from './Progress'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc,...props }) => {
  const { locale } = useGlobal()
  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  const [activeTab, setActiveTab] = useState('catalog'); // 默认激活文章目录Tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const { className, siteInfo } = props
  const router = useRouter()

  // 目录自动滚动
  const tRef = useRef(null)
  const tocIds = []

  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  const throttleMs = 200
  const actionSectionScrollSpy = useCallback(throttle(() => {
    const sections = document.getElementsByClassName('notion-h')
    let prevBBox = null
    let currentSectionId = activeSection
    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i]
      if (!section || !(section instanceof Element)) continue
      if (!currentSectionId) {
        currentSectionId = section.getAttribute('data-id')
      }
      const bbox = section.getBoundingClientRect()
      const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
      const offset = Math.max(150, prevHeight / 4)
      // GetBoundingClientRect returns values relative to viewport
      if (bbox.top - offset < 0) {
        currentSectionId = section.getAttribute('data-id')
        prevBBox = bbox
        continue
      }
      // No need to continue loop, if last element has been detected
      break
    }
    setActiveSection(currentSectionId)
    const index = tocIds.indexOf(currentSectionId) || 0
    tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
  }, throttleMs))

  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return <></>
  }

  return (
    <Card className="relative">
      <div className="flex justify-center items-center pb-6 space-x-4">
        <div
          className={`cursor-pointer px-4 py-2 text-sm rounded-lg text-gray-600 bg-gray-200 transition duration-200 ease-out ${
            activeTab === 'catalog' ? 'bg-tab text-white shadow-lg' : ''
          }`}
          onClick={() => handleTabClick('catalog')}
        >
          <i className="iconfont icon-list-ol"></i>
          {activeTab === 'catalog' && <span className="pl-1">文章目录</span>}
        </div>
        <div
          className={`cursor-pointer px-4 py-2 text-sm rounded-lg text-gray-600 bg-gray-200 transition duration-200 ease-out ${
            activeTab === 'infoCard' ? 'bg-tab text-white shadow-lg' : ''
          }`}
          onClick={() => handleTabClick('infoCard')}
        >
          <i className="iconfont icon-home" ></i>
          {activeTab === 'infoCard' && <span className="pl-1">站点概览</span>}
        </div>
      </div>
      <div className={`${activeTab === 'infoCard' ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out transform' : 'opacity-0 translate-y-10 max-h-0'}`}>
        <div
            className='justify-center items-center flex pb-3 dark:text-gray-100  transform duration-200 cursor-pointer'
            onClick={() => {
              router.push('/')
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <LazyImage src={siteInfo?.icon} className='rounded-full' width={120} alt={siteConfig('AUTHOR')} />
        </div>
        <div className='font-medium text-center text-xl pb-2'>{siteConfig('AUTHOR')}</div>
        <div className='text-md text-center'>{siteConfig('BIO')}</div>
        <MenuGroupCard {...props} />
        <SocialButton />
      </div>
      <div className={`${activeTab === 'catalog' ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out transform ' : 'opacity-0 translate-y-10 max-h-0'} `}>
        <div className='px-3 py-1'>
          <div className='w-full'><i className='mr-1 fas fa-stream' />{locale.COMMON.TABLE_OF_CONTENTS}</div>
          <div className='w-full py-3'>
            <Progress />
          </div>
          <div className='overflow-y-auto max-h-36 lg:max-h-96 overscroll-none scroll-hidden' ref={tRef}>
            <nav className='h-full  text-black'>
              {toc.map((tocItem) => {
                const id = uuidToId(tocItem.id)
                tocIds.push(id)
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-200
                  notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
                  >
                    <span style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
                      className={`${activeSection === id && ' font-bold text-indigo-600'}`}
                    >
                      {tocItem.text}
                    </span>
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
      
    </Card>    
  )
}

export default Catalog
