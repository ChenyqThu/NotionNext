import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 字数统计
 * @returns
 */
export default function WordCount({ wordCount, readTime }) {
  const { locale } = useGlobal()
  const hasProvidedStats = wordCount !== undefined && readTime !== undefined
  const [fallbackStats, setFallbackStats] = useState({
    wordCount: wordCount ?? 0,
    readTime: readTime ?? 0
  })

  useEffect(() => {
    if (hasProvidedStats) {
      setFallbackStats({ wordCount, readTime })
      return
    }

    const articleText = stripHtmlTags(
      document.getElementById('notion-article')?.innerHTML
    )
    const nextWordCount = countWords(articleText)

    setFallbackStats({
      wordCount: nextWordCount,
      readTime: Math.floor(nextWordCount / 400) + 1
    })
  }, [hasProvidedStats, readTime, wordCount])

  const resolvedWordCount = hasProvidedStats
    ? wordCount
    : fallbackStats.wordCount
  const resolvedReadTime = hasProvidedStats
    ? readTime
    : fallbackStats.readTime

  return (
    <span id='wordCountWrapper' className='flex gap-3 font-light'>
      <span className='flex whitespace-nowrap items-center'>
        <i className='pl-1 pr-2 fas fa-file-word' />
        <span>{locale.COMMON.WORD_COUNT}</span>&nbsp;
        <span id='wordCount'>{resolvedWordCount}</span>
      </span>
      <span className='flex whitespace-nowrap items-center'>
        <i className='mr-1 fas fa-clock' />
        <span>{locale.COMMON.READ_TIME}≈</span>&nbsp;
        <span id='readTime'>{resolvedReadTime}</span>&nbsp;
        {locale.COMMON.MINUTE}
      </span>
    </span>
  )
}

function stripHtmlTags(str) {
  if (!str) {
    return ''
  }

  return str.replace(/<[^>]+>|&[^>]+;/g, '').trim()
}

function countWords(str) {
  if (!str) {
    return 0
  }

  try {
    // eslint-disable-next-line no-irregular-whitespace
    let normalized = str.replace(/(\r\n+|\s+|　+)/g, '龘')
    // eslint-disable-next-line no-control-regex
    normalized = normalized.replace(/[\x00-\xff]/g, 'm')
    normalized = normalized.replace(/m+/g, '*')
    normalized = normalized.replace(/龘+/g, '')
    return normalized.length
  } catch (error) {
    return 0
  }
}
