<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute } from "vitepress";

const { frontmatter } = useData();
const route = useRoute();
const title = computed(() => frontmatter.value.title);
const date = computed(() => frontmatter.value.date.slice(0, 10));

const authorLink = computed(() => {
  return `https://alex-wayne-zj.github.io`;
});

const articleGithubLink = computed(() => {
  return `https://github.com/alex-wayne-zj/alex-wayne-zj.github.io/tree/main/docs${route.path}.md`;
});

const articleLink = computed(() => {
  return `https://alex-wayne-zj.github.io${route.path}`;
});
</script>

<template>
  <div class="text-sm">
    <hr>
    <section class="space-y-2">
      <div>
        <span>作者:&nbsp;</span>
        <span>
          <a :href="authorLink" rel="noreferrer" target="_blank">
            Alex
          </a>
        </span>
      </div>
      <div>
        <span>文章标题:&nbsp;</span>
        <span>
          <a :href="articleGithubLink" rel="noreferrer" target="_blank">
            {{ title }}
          </a>
        </span>
      </div>
      <div>
        <span>发表时间:&nbsp;</span>
        <span>
          <span>
            {{ date }}
          </span>
        </span>
      </div>
      <div>
        <span>文章链接:&nbsp;</span>
        <span>
          <a :href="articleLink" rel="noreferrer" target="_blank">
            {{ articleLink }}
          </a>
        </span>
      </div>
      <div>
        <span class="mr-1 font-medium">版权说明:</span>
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans" rel="noreferrer" target="_blank">
          <span>CC BY-NC-ND 4.0 DEED </span>
        </a>
      </div>
    </section>
    <hr>
  </div>
</template>

<style scoped>
a {
  color: #2563eb; 
  text-decoration: none;
}
</style>