---
name: react-native-rules
description: React Native 编码规范（强制）
---

# React Native 规范

## 1. 基本要求

- 使用 Function Component + TS
- 使用 React Native 官方组件

---

## 2. UI 规范

必须：

- 使用 View / Text / Image
- 不使用 div / span

---

## 3. 样式规范

必须：

- 使用 StyleSheet.create

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```
### 3.1 单位规范

- 使用数字（dp）

- 不使用 px / rem

### 3.2 Flex 布局（默认）
```tsx
flex: 1
flexDirection: 'row' | 'column'
```

## 4. 建议

- 使用 [UI 组件库](https://github.com/vinifmorais99/react-native-paper)
- 使用 [Context](https://reactjs.org/docs/context.html)
- 使用 [FlatList / SectionList](https://reactnative.dev/docs/flatlist)
- 避免使用 state 的 state
- 遵循 [三步法](https://github.com/dan_abramov/three-parts-talk)

## 5.禁止使用 Web 元素
❌
```tsx
div / span / img
```

✅
```tsx
View / Text / Image
```

## 6.文本必须包裹在 Text 中

❌
<View>Hello</View>
```

❌
```tsx
<Text>Helloworld</Text>
```

✅
```tsx
<Text>hello <Text>world</Text></Text>
```

## 7. 自检清单（必须）

- [ ]是否有副作用泄漏是否使用 RN 组件

- [ ]是否有副作用泄漏是否使用 StyleSheet

- [ ]是否有副作用泄漏是否存在匿名函数

- [ ]是否有副作用泄漏是否使用 useCallback

- [ ]是否有副作用泄漏是否使用 FlatList

- [ ]是否有副作用泄漏是否违反 hooks-rules

- [ ]是否有副作用泄漏是否违反 event-rules

- [ ]是否有副作用泄漏是否存在性能问题

- [ ]是否有副作用泄漏是否有平台差异问题

- [ ]是否有副作用泄漏是否符合跨端规范