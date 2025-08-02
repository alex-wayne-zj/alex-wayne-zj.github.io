<template>
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-if="prev" class="group col-start-1">
      <a :href="prev.url" class="block">
        <div class="relative w-full rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all">
          <img
            class="w-full aspect-[2.35/1] object-cover"
            :src="prev.cover"
            :alt="prev.title"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <div class="text-sm opacity-80">上一篇</div>
            <h2 class="text-lg font-semibold truncate">{{ prev.title }}</h2>
          </div>
        </div>
      </a>
    </div>

    <div v-if="next" class="group col-start-2">
      <a :href="next.url" class="block">
        <div class="relative w-full rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all">
          <img
            class="w-full aspect-[2.35/1] object-cover"
            :src="next.cover"
            :alt="next.title"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <div class="text-sm opacity-80 text-right">下一篇</div>
            <h2 class="text-lg font-semibold truncate text-right">{{ next.title }}</h2>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useRoute} from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const modules = import.meta.glob('../../../**/*.md', { eager: true })

const blogs = Object.entries(modules)
  .filter(([_, mod]) => !mod.__pageData.frontmatter.hide)
  .map(([path, mod]) => {
    return {
      title: mod.__pageData.frontmatter.title,
      date: new Date(mod.__pageData.frontmatter.date),
      tags: mod.__pageData.frontmatter.tags,
      url: "../" + path.split('/')[3] + "/",
      cover: "../../" + path.split('/')[3] + "/" + mod.__pageData.frontmatter.cover
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime())

const currentIndex = computed(() => {
  return blogs.findIndex(blog => blog.url.slice(2) === route.path)
})

const prev = computed(() => (currentIndex.value > 0 ? blogs[currentIndex.value - 1] : null))
const next = computed(() => (currentIndex.value < blogs.length - 1 ? blogs[currentIndex.value + 1] : null))
</script>