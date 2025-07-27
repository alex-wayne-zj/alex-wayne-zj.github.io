<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Tag 过滤栏 -->
    <!-- <div class="flex flex-wrap justify-center gap-4 mb-6">
      <button
        v-for="tag in allTags"
        :key="tag.name"
        @click="selectedTag = tag.name"
        :class="[
          'px-4 py-1 rounded-full border',
          selectedTag === tag.name ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
        ]"
      >
        {{ tag.name }}：{{ tag.count }}
      </button>
    </div> -->

    <!-- 博客卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        v-for="blog in blogs"
        :key="blog.cover"
        :blog="blog"
      />
    </div>

    <!-- 分页器 -->
    <!-- <div class="mt-8 flex justify-center space-x-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-1 border rounded',
          page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
        ]"
      >
        {{ page }}
      </button>
    </div> -->
  </div>
</template>

<script setup>
import Card from './Card.vue'

const modules = import.meta.glob('../../../**/*.md', {eager: true})

const blogs = Object.entries(modules)
  .filter(([_, mod]) => !mod.__pageData.frontmatter.hide)
  .map(([path, mod]) => {
    return {
      title: mod.__pageData.frontmatter.title,
      date: new Date(mod.__pageData.frontmatter.date),
      tags: mod.__pageData.frontmatter.tags,
      url: path.split('/')[3] + "/",
      cover: mod.__pageData.frontmatter.cover
    }
}).sort((a, b) => b.date.getTime() - a.date.getTime()) 

console.log("blogs:", blogs)

// const selectedTag = ref('最新')

// const filteredblogs = computed(() => {
//   if (selectedTag.value === '最新') return blogs.value
//   return blogs.value.filter(blog => blog.tags.includes(selectedTag.value))
// })

// const pageSize = 12
// const currentPage = ref(1)

// const totalPages = computed(() =>
//   Math.ceil(filteredblogs.value.length / pageSize)
// )

// const pagedblogs = computed(() => {
//   const start = (currentPage.value - 1) * pageSize
//   return filteredblogs.value.slice(start, start + pageSize)
// })

// const allTags = computed(() => {
//   const tagMap = new Map()
//   blogs.value.forEach(blog => {
//     (blog.tags || []).forEach(tag => {
//       tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
//     })
//   })
//   const list = [{ name: '最新', count: blogs.value.length }]
//   tagMap.forEach((count, name) => list.push({ name, count }))
//   return list
// })
</script>
