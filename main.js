document.getElementById('exportBtn').addEventListener('click', function () {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = '人物关系数据.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

document.getElementById('importBtn').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            try {
                data = JSON.parse(content);
                // 重新渲染图表
                map.innerHTML = '';
                new RelationChart(map, data);
                alert('数据导入成功！');
            } catch (err) {
                alert('导入失败：' + err.message);
            }
        }
    }

    input.click();
});

// 新增:头像选择逻辑
document.getElementById('selectAvatarBtn').addEventListener('click', function () {
    const fileInput = document.getElementById('avatarFileInput');
    fileInput.click();
});

// 确保avatarInput元素存在
const avatarInput = document.createElement('input');
avatarInput.type = 'text';
avatarInput.id = 'avatarInput';
avatarInput.style.display = 'none';
document.querySelector('.form-section').appendChild(avatarInput);

document.getElementById('avatarFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const filePath = URL.createObjectURL(file);
        document.getElementById('avatarInput').value = filePath;
    }
});

/**
 * 添加人物按钮点击事件处理函数
 * 包含详细的表单验证逻辑和友好的错误提示
 */
document.getElementById('addPersonBtn').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value.trim();
    const roleIdStr = document.getElementById('roleIdInput').value.trim();
    const groupStr = document.getElementById('groupInput').value.trim();
    const avatarInput = document.getElementById('avatarInput');
    const avatar = avatarInput ? avatarInput.value.trim() : '';

    // 验证姓名
    if (!name) {
        alert('请输入姓名！');
        document.getElementById('nameInput').focus();
        return;
    }

    // 验证角色ID
    if (!roleIdStr) {
        alert('请输入角色ID！');
        document.getElementById('roleIdInput').focus();
        return;
    }
    const roleId = parseInt(roleIdStr);
    if (isNaN(roleId)) {
        alert('角色ID必须是数字！');
        document.getElementById('roleIdInput').focus();
        return;
    }

    // 验证分组
    if (!groupStr) {
        alert('请输入分组！');
        document.getElementById('groupInput').focus();
        return;
    }
    const group = parseInt(groupStr);
    if (isNaN(group)) {
        alert('分组必须是数字！');
        document.getElementById('groupInput').focus();
        return;
    }

    // 验证头像
    if (!avatar) {
        alert('请选择头像！');
        document.getElementById('selectAvatarBtn').focus();
        return;
    }

    // 检查角色ID是否已存在
    const isDuplicate = data.nodes.some(node => node.role_id === roleId);
    if (isDuplicate) {
        alert('角色ID已存在，请使用唯一的角色ID！');
        return;
    }

    // 添加新人物
    data.nodes.push({
        name,
        role_id: roleId,
        group,
        avatar
    });

    // 清空输入框
    document.getElementById('nameInput').value = '';
    document.getElementById('roleIdInput').value = '';
    document.getElementById('groupInput').value = '';
    document.getElementById('avatarInput').value = '';

    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);

    alert('人物添加成功！');
});

/**
 * 添加关系按钮点击事件处理函数
 * 包含详细的表单验证逻辑和友好的错误提示
 */
// 删除人物按钮点击事件处理函数
document.getElementById('deletePersonBtn').addEventListener('click', function () {
    const roleIdStr = document.getElementById('roleIdInput').value.trim();
    
    if (!roleIdStr) {
        alert('请输入要删除的角色ID！');
        return;
    }
    
    const roleId = parseInt(roleIdStr);
    if (isNaN(roleId)) {
        alert('角色ID必须是数字！');
        return;
    }
    
    const nodeIndex = data.nodes.findIndex(node => node.role_id === roleId);
    if (nodeIndex === -1) {
        alert('未找到该角色ID对应的人物！');
        return;
    }
    
    // 删除与该节点相关的所有关系
    data.links = data.links.filter(link => {
        const sourceNode = data.nodes[link.source];
        const targetNode = data.nodes[link.target];
        return sourceNode.role_id !== roleId && targetNode.role_id !== roleId;
    });
    
    // 删除节点
    data.nodes.splice(nodeIndex, 1);
    
    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);
    
    alert('人物删除成功！');
});

// 修改人物按钮点击事件处理函数
document.getElementById('editPersonBtn').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value.trim();
    const roleIdStr = document.getElementById('roleIdInput').value.trim();
    const groupStr = document.getElementById('groupInput').value.trim();
    const avatarInput = document.getElementById('avatarInput');
    const avatar = avatarInput ? avatarInput.value.trim() : '';
    
    if (!roleIdStr) {
        alert('请输入要修改的角色ID！');
        return;
    }
    
    const roleId = parseInt(roleIdStr);
    if (isNaN(roleId)) {
        alert('角色ID必须是数字！');
        return;
    }
    
    const nodeIndex = data.nodes.findIndex(node => node.role_id === roleId);
    if (nodeIndex === -1) {
        alert('未找到该角色ID对应的人物！');
        return;
    }
    
    // 更新人物信息
    if (name) data.nodes[nodeIndex].name = name;
    if (groupStr) data.nodes[nodeIndex].group = parseInt(groupStr);
    if (avatar) data.nodes[nodeIndex].avatar = avatar;
    
    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);
    
    alert('人物信息修改成功！');
});

document.getElementById('addRelationBtn').addEventListener('click', function () {
    const sourceStr = document.getElementById('sourceInput').value.trim();
    const targetStr = document.getElementById('targetInput').value.trim();
    const relation = document.getElementById('relationInput').value.trim();
    const color = document.getElementById('colorInput').value.trim();

    // 验证源节点ID
    if (!sourceStr) {
        alert('请输入源节点ID！');
        document.getElementById('sourceInput').focus();
        return;
    }
    const source = parseInt(sourceStr);
    if (isNaN(source)) {
        alert('源节点ID必须是数字！');
        document.getElementById('sourceInput').focus();
        return;
    }

    // 验证目标节点ID
    if (!targetStr) {
        alert('请输入目标节点ID！');
        document.getElementById('targetInput').focus();
        return;
    }
    const target = parseInt(targetStr);
    if (isNaN(target)) {
        alert('目标节点ID必须是数字！');
        document.getElementById('targetInput').focus();
        return;
    }

    // 验证关系描述
    if (!relation) {
        alert('请输入关系描述！');
        document.getElementById('relationInput').focus();
        return;
    }

    // 检查源节点和目标节点是否存在
    const sourceNode = data.nodes.find(node => node.role_id === source);
    const targetNode = data.nodes.find(node => node.role_id === target);

    if (!sourceNode || !targetNode) {
        alert('源节点或目标节点不存在，请检查角色ID！');
        return;
    }

    // 添加新关系
    data.links.push({
        source: data.nodes.indexOf(sourceNode),
        target: data.nodes.indexOf(targetNode),
        relation,
        color
    });

    // 清空输入框
    document.getElementById('sourceInput').value = '';
    document.getElementById('targetInput').value = '';
    document.getElementById('relationInput').value = '';
    document.getElementById('colorInput').value = '';

    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);

    alert('关系添加成功！');
});

/**
 * 删除关系按钮点击事件处理函数
 * 包含详细的表单验证逻辑和友好的错误提示
 */
document.getElementById('deleteRelationBtn').addEventListener('click', function () {
    const sourceStr = document.getElementById('sourceInput').value.trim();
    const targetStr = document.getElementById('targetInput').value.trim();
    
    // 验证源节点ID
    if (!sourceStr) {
        alert('请输入源节点ID！');
        document.getElementById('sourceInput').focus();
        return;
    }
    const source = parseInt(sourceStr);
    if (isNaN(source)) {
        alert('源节点ID必须是数字！');
        document.getElementById('sourceInput').focus();
        return;
    }

    // 验证目标节点ID
    if (!targetStr) {
        alert('请输入目标节点ID！');
        document.getElementById('targetInput').focus();
        return;
    }
    const target = parseInt(targetStr);
    if (isNaN(target)) {
        alert('目标节点ID必须是数字！');
        document.getElementById('targetInput').focus();
        return;
    }

    // 检查源节点和目标节点是否存在
    const sourceNode = data.nodes.find(node => node.role_id === source);
    const targetNode = data.nodes.find(node => node.role_id === target);

    if (!sourceNode || !targetNode) {
        alert('源节点或目标节点不存在，请检查角色ID！');
        return;
    }

    // 查找并删除关系
    const sourceIndex = data.nodes.indexOf(sourceNode);
    const targetIndex = data.nodes.indexOf(targetNode);
    
    const relationIndex = data.links.findIndex(link => 
        (link.source === sourceIndex && link.target === targetIndex) ||
        (link.source === targetIndex && link.target === sourceIndex)
    );

    if (relationIndex === -1) {
        alert('未找到这两个节点之间的关系！');
        return;
    }

    // 删除关系
    data.links.splice(relationIndex, 1);

    // 清空输入框
    document.getElementById('sourceInput').value = '';
    document.getElementById('targetInput').value = '';
    document.getElementById('relationInput').value = '';
    document.getElementById('colorInput').value = '';

    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);

    alert('关系删除成功！');
});

/**
 * 修改关系按钮点击事件处理函数
 * 包含详细的表单验证逻辑和友好的错误提示
 */
document.getElementById('editRelationBtn').addEventListener('click', function () {
    const sourceStr = document.getElementById('sourceInput').value.trim();
    const targetStr = document.getElementById('targetInput').value.trim();
    const relation = document.getElementById('relationInput').value.trim();
    const color = document.getElementById('colorInput').value.trim();
    
    // 验证源节点ID
    if (!sourceStr) {
        alert('请输入源节点ID！');
        document.getElementById('sourceInput').focus();
        return;
    }
    const source = parseInt(sourceStr);
    if (isNaN(source)) {
        alert('源节点ID必须是数字！');
        document.getElementById('sourceInput').focus();
        return;
    }

    // 验证目标节点ID
    if (!targetStr) {
        alert('请输入目标节点ID！');
        document.getElementById('targetInput').focus();
        return;
    }
    const target = parseInt(targetStr);
    if (isNaN(target)) {
        alert('目标节点ID必须是数字！');
        document.getElementById('targetInput').focus();
        return;
    }

    // 检查源节点和目标节点是否存在
    const sourceNode = data.nodes.find(node => node.role_id === source);
    const targetNode = data.nodes.find(node => node.role_id === target);

    if (!sourceNode || !targetNode) {
        alert('源节点或目标节点不存在，请检查角色ID！');
        return;
    }

    // 查找关系
    const sourceIndex = data.nodes.indexOf(sourceNode);
    const targetIndex = data.nodes.indexOf(targetNode);
    
    const relationIndex = data.links.findIndex(link => 
        (link.source === sourceIndex && link.target === targetIndex) ||
        (link.source === targetIndex && link.target === sourceIndex)
    );

    if (relationIndex === -1) {
        alert('未找到这两个节点之间的关系！');
        return;
    }

    // 更新关系
    if (relation) data.links[relationIndex].relation = relation;
    if (color) data.links[relationIndex].color = color;

    // 清空输入框
    document.getElementById('sourceInput').value = '';
    document.getElementById('targetInput').value = '';
    document.getElementById('relationInput').value = '';
    document.getElementById('colorInput').value = '';

    // 重新渲染图表
    map.innerHTML = '';
    new RelationChart(map, data);

    alert('关系修改成功！');
});

// 新增:搜索功能
document.getElementById('searchBtn').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('请输入姓名进行搜索！');
        return;
    }

    const results = data.nodes.filter(node => node.name.includes(searchTerm));
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>未找到匹配的结果。</p>';
        return;
    }

    const resultList = document.createElement('ul');
    results.forEach(node => {
        const listItem = document.createElement('li');
        listItem.textContent = `姓名: ${node.name}, 角色ID: ${node.role_id}`;
        resultList.appendChild(listItem);
    });

    resultsContainer.appendChild(resultList);
});

// 检测系统主题设置
function checkSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 监听系统主题变化
function watchSystemTheme(callback) {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            callback(e.matches ? 'dark' : 'light');
        });
    }
}

// 新增:夜间模式切换逻辑
document.getElementById('themeSelector').addEventListener('change', function () {
    const theme = this.value;
    localStorage.setItem('themeSetting', theme);
    
    if (theme === 'system') {
        const systemTheme = checkSystemTheme();
        if (systemTheme === 'dark') {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    } else if (theme === 'dark') {
        document.body.classList.add('night-mode');
        localStorage.setItem('nightMode', true);
    } else {
        document.body.classList.remove('night-mode');
        localStorage.setItem('nightMode', false);
    }
});

// 页面加载时检查主题设置
const themeSetting = localStorage.getItem('themeSetting') || 'system';

if (themeSetting === 'system') {
    const systemTheme = checkSystemTheme();
    if (systemTheme === 'dark') {
        document.body.classList.add('night-mode');
    } else {
        document.body.classList.remove('night-mode');
    }
    watchSystemTheme((theme) => {
        if (theme === 'dark') {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    });
} else {
    const isNightMode = localStorage.getItem('nightMode') === 'true';
    if (isNightMode) {
        document.body.classList.add('night-mode');
    }
}

// 新增:侧边栏切换逻辑
document.querySelector('.sidebar-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('open');
});

// 新增:侧边栏分区折叠逻辑
document.querySelectorAll('.sidebar-section-header').forEach(header => {
    header.addEventListener('click', function () {
        const section = this.parentElement;
        section.classList.toggle('open');
        const arrow = this.querySelector('span');
        arrow.textContent = section.classList.contains('open') ? '▲' : '▼';
    });
});

let data = {
    nodes: [],
    links: []
};

// 确保data对象在全局可用
window.data = data;

var map = document.querySelector('#map');
console.log(new RelationChart(map, data));