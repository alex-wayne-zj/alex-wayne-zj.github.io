import DefaultTheme from 'vitepress/theme'
import Layout from "./Layout.vue";
import "./tailwind.css";

export default {
  ...DefaultTheme,
  Layout: Layout,
}