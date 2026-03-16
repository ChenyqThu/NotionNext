import { DynamicLayout } from '@/themes/theme'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import React from 'react'
import BLOG from '@/blog.config'

const MemosIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props?.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutMemos' {...props} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await fetchGlobalAllData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default MemosIndex
