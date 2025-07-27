<script setup>
import DefaultTheme from 'vitepress/theme'
import CopyRight from './components/CopyRight.vue';
import BlogHeader from './components/Header.vue';
import Gallery from './components/Gallery.vue';

const { Layout } = DefaultTheme

</script>

<template>
  <Layout>
    <!-- 文章顶部模块 -->
    <template #doc-before>
      <BlogHeader />
    </template>

    <!-- 博客末尾的版权说明和文章导航 -->
    <template #doc-footer-before>
      <CopyRight />
      <!-- <BlogBottomNav /> -->
    </template>

    <!-- 主页标签列表模块 -->
    <!-- <template #home-hero-before>
      <TagNav />
    </template> -->
    <!-- 主页博客列表模块 -->
    <template #home-hero-after>
      <Gallery />
    </template>
  </Layout>
</template>