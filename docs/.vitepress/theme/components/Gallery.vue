<template>
  <div class="max-w-7xl mx-auto px-4 py-1">
    <!-- 标签分类-->
    <div class="flex items-center justify-center flex-wrap gap-4 mb-4">
      <div class="cursor-pointer font-semibold hover:underline select-none" @click="showTags = !showTags">
        Tags <span>{{ showTags ? '⏴' : '⏵' }}</span>
      </div>
      <div class="flex flex-wrap items-center gap-4 overflow-hidden transition-all ease-in-out duration-800"
        :class="showTags ? 'opacity-100 ml-4' : 'max-w-0 max-h-0 opacity-0'">
        <span v-for="tag in allTags" :key="tag.name" @click="selectedTag = tag.name" :class="[
          'cursor-pointer text-sm transition',
          selectedTag === tag.name
            ? 'underline underline-offset-4 font-semibold'
            : 'text-gray-600 hover:text-black'
        ]">
          {{ tag.name }} ({{ tag.count }})
        </span>
      </div>
    </div>

    <!-- 博客卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="blog in pagedblogs" :key="blog.cover" :blog="blog" />
    </div>

    <!-- 分页器 -->
    <div class="mt-4 flex justify-center space-x-4 text-sm" v-if="totalPages > 1">
      <span v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
        'cursor-pointer transition select-none',
        page === currentPage
          ? 'font-semibold underline underline-offset-4'
          : 'hover:text-black'
      ]">
        {{ page }}
      </span>
    </div>

    <div class="flex items-center justify-center mt-4">
      <span class="text-sm">Stay Sharp. Stay Gentle.</span>
      <hr>
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue'
import { ref, computed } from 'vue';
import { blogs } from './data.js'

const selectedTag = ref('最新')
const showTags = ref(false)

const filteredblogs = computed(() => {
  if (selectedTag.value === '最新') return blogs
  return blogs.filter(blog => blog.tags.includes(selectedTag.value))
})

const pageSize = 12
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(filteredblogs.value.length / pageSize)
)

const pagedblogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredblogs.value.slice(start, start + pageSize)
})

const allTags = computed(() => {
  const tagMap = new Map()
  blogs.forEach(blog => {
    (blog.tags || []).forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  const list = [{ name: '最新', count: blogs.length }]
  tagMap.forEach((count, name) => list.push({ name, count }))
  return list
})
</script>