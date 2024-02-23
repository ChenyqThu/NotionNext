import React, { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

const BlogMemos = (props) => {
    useEffect(() => {
        // 动态加载CSS文件
        loadExternalResource('/css/memos.css', 'css')
        loadExternalResource('/css/highlight.github.min.css','css')
    
        // 动态加载JavaScript文件
        loadExternalResource('/js/lazyload.min.js?v=17.8.3', 'js')
        loadExternalResource('/js/marked.min.js?v=11.1.1', 'js')
        loadExternalResource('/js/view-image.min.js?v=2.0.2', 'js')
        loadExternalResource('/js/moment.min.js?v=2.30.1', 'js')
        loadExternalResource('/js/moment.twitter.js', 'js')
        loadExternalResource('/js/highlight.min.js?v=11.9.0', 'js')
        loadExternalResource('/js/memos.js', 'js')
    }, []);
    
    return (<section id="main" className="container">
        <h1>Memos Top</h1>
        <div class="total">Total <span id="total">0</span> Memos 🎉</div>
        <blockquote id="tag-filter" class="filter">
            <div id="tags"></div>
        </blockquote>

        <div id="memos" class="memos">
        </div></section>
    );
    return (<>
        <h1>Memos Top</h1>
        <div class="total">Total <span id="total">0</span> Memos 🎉</div>
        <blockquote id="tag-filter" class="filter">
            <div id="tags"></div>
        </blockquote>

        <div id="memos" class="memos">
        </div>

        <script type="text/javascript" src="/js/lazyload.min.js?v=17.8.3"></script>
        <script type="text/javascript" src="/js/marked.min.js?v=11.1.1"></script>
        
        <script type="text/javascript" src="/js/view-image.min.js?v=2.0.2"></script>

        <script type="text/javascript" src="/js/moment.min.js?v=2.30.1"></script>
        <script type="text/javascript" src="/js/moment.twitter.js"></script>

        <script type="text/javascript" src="/js/highlight.min.js?v=11.9.0"></script>
        <script type="text/javascript" src="/js/memos.js"></script>
        <script>hljs.highlightAll();</script>
    </>)
};

export default BlogMemos;
