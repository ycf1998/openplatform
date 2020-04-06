const getters = {

  sidebar: state => state.app.sidebar, // 侧边栏的打开与缩小
  size: state => state.app.size, // medium
  device: state => state.app.device, // pc端或移动端(desktop or mobile)
  visitedViews: state => state.tagsView.visitedViews, // 数组，打开的选项卡
  cachedViews: state => state.tagsView.cachedViews, // 缓存的视图
  errorLogs: state => state.errorLog.logs,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  type: state => state.user.type,
  roles: state => state.user.roles,

  // permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
