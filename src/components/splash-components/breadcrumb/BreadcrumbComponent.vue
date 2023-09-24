<template>
  <ol class="breadcrumb" :class="breadcrumbColor">
    <li
      v-for="item in items"
      :key="item.name"
      class="breadcrumb-item"
      :class="item.active ? 'active' : ''">
      <a :href="item.url">
        {{ item.name }}
      </a>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { type PropType, onMounted, ref } from 'vue';

const colorBreadcrumb = ref("");

const breadcrumbColor = (() => {
  return colorBreadcrumb;
});

const props = defineProps({
  items: {
    type: Array as PropType<ItemDefinition[]>,
    required: true,
    default: () => [],
  },
  color: {
    type: String as PropType<ColorDefinition>
  },
});




onMounted(() => {
  switch (props.color) {
    case ColorDefinition.DANGER:
      colorBreadcrumb.value = ColorDefinition.DANGER;
      break;
    case ColorDefinition.INFO:
      colorBreadcrumb.value = ColorDefinition.INFO;
      break;
    case ColorDefinition.WARNING:
      colorBreadcrumb.value = ColorDefinition.WARNING;
      break;
    case ColorDefinition.SUCCESS:
      colorBreadcrumb.value = ColorDefinition.SUCCESS;
      break;
    default:
      colorBreadcrumb.value = ColorDefinition.PRIMARY;
      break;
  }
});


</script>

<script lang="ts">
  export enum ColorDefinition {
    DANGER = "danger",
    INFO = "info",
    PRIMARY = "primary",
    WARNING = "warning",
    SUCCESS = "success",
    DEFAULT = "default",
  };
  
  export interface ItemDefinition {
    name: String;
    active?: boolean;
    url: String;
  };
</script>



<style scoped lang="scss">
*, ::after, ::before {
  box-sizing: border-box;
}
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
  "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-border-radius: 0px;
  -moz-border-radius: 0px;
  border-radius: 0px;
  box-shadow: none;
  background-color: transparent;
  padding: 15px 0;
  border: none;
  text-transform: uppercase;
  padding: 15px 16px 15px 16px;
  background-color: #fff;

  &.danger {
    .active a, a:focus, a:hover, a:active {
      color: #D83C31 !important;
    }
  }
  &.primary {
    .active a, a:focus, a:hover, a:active {
      color: #7252D3 !important;
    }
  }
  &.warning {
    .active a, a:focus, a:hover, a:active {
      color: #FFd945 !important;
    }
  }
  &.info {
    .active a, a:focus, a:hover, a:active {
      color: #3B4752 !important;
    }
  }
  &.success {
    .active a, a:focus, a:hover, a:active {
      color: #19AD79 !important;
    }
  }

  & > .breadcrumb-item + .breadcrumb-item:before {
    color: #4b4b4b;
    font-family: "pages-icon";
    content: "\e988";
    font-size: 16px;
  }
  .breadcrumb-item {
    display: flex;
    padding-left: 0px;

    a {
      margin-left: 5px;
      margin-right: 5px;
      font-size: 10.5px !important;
      letter-spacing: 0.06em;
      font-weight: 500;
      color: #4b4b4b;
      text-shadow: none !important;
      transition: color 0.1s linear 0s,
      background-color 0.1s linear 0s, opacity 0.2s linear 0s !important;
      background-color: transparent;
    }

    a, a:focus, a:hover, a:active {
      outline: 0 !important;
      text-decoration: none;
    }
  }

  & > .breadcrumb-item.active {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #4e37b6;
    margin-left: 4px;
    margin-right: 5px;
    font-size: 10.5px !important;
    letter-spacing: 0.06em;
  }
}
</style>
