# 领动公共页头&侧边栏导航

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).



# 1.内置api

### 页头
#### 菜单导航回调
[点击查看图片](https://a0.leadongcdn.com/cloud/jlBpkKkjliSRiknjkmqkio/image.png)
```js
const changeNavigation = (item) => {
  console.log("头部导航", item);
};
```
#### 帮助模块回调
[点击查看图片](https://a0.leadongcdn.com/cloud/joBpkKkjliSRiknjkmmkio/image.png)
```js
const helpVideoFunc = (item) => {
  console.log("帮助模块",item);
};
```
#### 选择网站回调
[点击查看图片](https://a0.leadongcdn.com/cloud/jnBpkKkjliSRiknjkmpkio/image.png)
```js
const changeWebsite = (item) => {
  console.log("选择网站", item);
};
```

### 侧边栏
#### 菜单导航回调
[点击查看图片](https://a0.leadongcdn.com/cloud/jkBpkKkjliSRiknjkmokio/image.png)
```html
const changeSideNavigation = async (item) => {
  console.log("菜单导航",item);
};
```

#### 切换导航
```js
window.top.postMessage('website.leadong.com/video?iframe=1', '*');
```

#### 触发导航高亮
```html
<!--html-->
<ld-menu
  :ref="(el) => (menuStore.ldMenuChild = el)"
  :menu="menu"
  v-if="menu.sideNavigation && Object.keys(menu.sideNavigation).length > 0"
  @changeSideNavigation="changeSideNavigation"
></ld-menu>

```
```js
//js
menuStore.ldMenuChild.menuSwitch(arr, true);
/*
触发导航高亮  menuSwitch();示例： 
参数1：传入类型-数组(Array) ，示例：导航中文名称：1级导航名称，如有2级导航数组第二位为2级导航key["key"，"key2"]
参数2：true(Boolean)
触发导航 默认选中第一个
参数1：任意类型(any)
参数2：false(Boolean)
*/
```



# 2.插槽

## (1) 使用: template 后# 开头的字段为固定插槽字段 pcHeaderSlot,phoneHeaderSlot,pcHeaderSlotTwo,loginSlot,menuSlot

### 页头

```html
<!--html-->
<ldHeader>
    <template #pcHeaderSlot>
      <div>页头插槽</div>
    </template>
    <template #phoneHeaderSlot>
      <div>页头移动端插槽</div>
    </template>
    <template #pcHeaderSlotTwo>
      <div>页头插槽2</div>
    </template>
    <template #loginSlot>
      <div>登录头像插槽</div>
    </template>
</ldHeader>
```

### 侧边栏
```html
<!--html-->
<LdMenu>
    <template #menuSlot>
        <div>侧边栏插槽</div>
    </template>
</LdMenu>
```
## (2) 排序: 使用固定字段作为排序数组传入页头组件内 页头（headerModuleOrder）侧边栏（menuModuleOrder）
## headerModuleOrder和menuModuleOrder 不传代表默认排序

### 使用示例
### 示例说明 name字段代表 模块的class，order字段代表 模块的顺序
```html
<!--html-->
<ldHeader ref="RefLdMenu" :menu="menu" :headerModuleOrder="headerModuleOrder" :menuModuleOrder="menuModuleOrder" :websiteKeys="websiteKeys" v-if="menu.headerNavigation &&
      Object.keys(menu.headerNavigation).length > 0 &&
      websiteKeys &&
      Object.keys(websiteKeys).length > 0
      " @changeNavigation="changeNavigation" @changeWebsite="changeWebsite" @helpVideoFunc="helpVideoFunc">
    </ldHeader>
    <!-- headerModuleOrder,menuModuleOrder都放在页头中 -->
```

```js
//页头组件模块自定义排序示例
const headerModuleOrder = reactive({
  orderList: [
    {
      name: "wrap-logo",
      order: 1,
    },
    {
      name: "wrap-webSite",
      order: 2,
    },
    {
      name: "wrap-navigationList",
      order: 3,
    },
    {
      name: "wrap-foreground",
      order: 4,
    },
    {
      name: "wrap-help",
      order: 5,
    },
    {
      name: "wrap-message",
      order: 6,
    },
    {
      name: "wrap-login",
      order: 7,
    },
    {
      name: "wrap-slot",
      order: 8,
    },
    {
      name: "wrap-slotTwo",
      order: 9,
    },
    {
      name: "wrap-slot-phone",
      order: 8,
    },
  ],
});
```

```js
//侧边栏组件模块自定义排序示例
const menuModuleOrder = reactive({
  orderList: [
    {
      name: "ld-menu-header",
      order: 1,
    },
    {
      name: "ld-menu-collapsed",
      order: 2,
    },
    {
      name: "ld-menu-wrap",
      order: 3,
    },
    {
      name: "ld-menu-slot",
      order: 1,
    },
  ],
});
```
ps:
账号：demo-xuke
域名：http://en-xuke.ldmfyh.com
资料库
文件名：ld-navigation