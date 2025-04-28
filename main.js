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

document.getElementById('addPersonBtn').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value.trim();
    const roleId = parseInt(document.getElementById('roleIdInput').value.trim());
    const group = parseInt(document.getElementById('groupInput').value.trim());
    const avatarInput = document.getElementById('avatarInput');
    const avatar = avatarInput ? avatarInput.value.trim() : '';

    if (!name || isNaN(roleId) || isNaN(group) || !avatar) {
        alert('请填写所有字段！');
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

document.getElementById('addRelationBtn').addEventListener('click', function () {
    const source = parseInt(document.getElementById('sourceInput').value.trim());
    const target = parseInt(document.getElementById('targetInput').value.trim());
    const relation = document.getElementById('relationInput').value.trim();
    const color = document.getElementById('colorInput').value.trim();

    if (isNaN(source) || isNaN(target) || !relation) {
        alert('请填写所有字段！');
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

// 新增:夜间模式切换逻辑
document.getElementById('nightModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('night-mode');
    const isNightMode = document.body.classList.contains('night-mode');
    localStorage.setItem('nightMode', isNightMode);
});

// 页面加载时检查是否启用夜间模式
const isNightMode = localStorage.getItem('nightMode') === 'true';
if (isNightMode) {
    document.body.classList.add('night-mode');
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