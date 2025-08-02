<template>
  <a
    :href="blog.url"
    class="block w-full rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
  >
    <!-- 上半部分：图片 -->
    <div class="w-full aspect-[2.35/1] overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="blog.cover"
        :alt="blog.title"
      />
    </div>
    <!-- 下半部分：标题和日期 -->
    <div class="p-4 bg-gray-100 dark:bg-zinc-900" >
      <span class="text-lg font-bold leading-tight line-clamp-2">
        {{ blog.title }}
      </span>
      <p class="text-xs mt-1">
        {{ blog.date.toISOString().split('T')[0] }}
      </p>
    </div>
  </a>
</template>

<script setup>
defineProps({
  blog: {
    type: Object,
    required: true
  }
})
</script>
