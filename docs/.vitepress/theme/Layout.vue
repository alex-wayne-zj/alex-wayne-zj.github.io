<script setup>
import DefaultTheme from 'vitepress/theme'
import BlogHeader from './components/Header.vue';
import CopyRight from './components/CopyRight.vue';
import BottomNav from './components/BottomNav.vue';
import Gallery from './components/Gallery.vue';

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- 导航栏社交链接添加豆瓣 -->
    <template #nav-bar-content-after>
      <a
        href="https://www.douban.com/people/200088204"
        target="_blank"
        class="ml-4 flex items-center"
        aria-label="Douban"
      >
        <img src="./icons/douban.svg" class="w-5 h-5" alt="Douban" />
      </a>
    </template>

    <!-- 文章顶部模块 -->
    <template #doc-before>
      <BlogHeader />
    </template>

    <!-- 博客末尾的版权说明和文章导航 -->
    <template #doc-footer-before>
      <CopyRight />
      <BottomNav />
    </template>

    <!-- 主页博客列表模块 -->
    <template #home-hero-after>
      <Gallery />
    </template>
  </Layout>
</template>