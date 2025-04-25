// 为搜索按钮添加点击事件监听器
document.getElementById('searchBtn').addEventListener('click', function () {
    // 获取搜索框的值并去除前后空格
    const searchInput = document.getElementById('searchInput').value.trim();
    // 获取搜索结果容器
    const searchResults = document.getElementById('searchResults');
    // 清空之前的搜索结果
    searchResults.innerHTML = '';

    // 检查搜索输入是否为空
    if (!searchInput) {
        // 如果为空，提示用户输入姓名进行搜索
        alert('请输入姓名进行搜索！');
        return;
    }

    // 使用filter方法筛选出名称中包含搜索输入的节点
    const matchedNodes = data.nodes.filter(node => node.name.includes(searchInput));
    // 如果没有找到匹配的节点，显示相应的消息
    if (matchedNodes.length === 0) {
        searchResults.innerHTML = '<p>未找到匹配的姓名。</p>';
        return;
    }

    // 创建一个无序列表元素用于显示搜索结果
    const resultsList = document.createElement('ul');
    // 遍历匹配的节点，为每个节点创建一个列表项元素
    matchedNodes.forEach(node => {
        const listItem = document.createElement('li');
        // 设置列表项的文本内容为节点的姓名和角色ID
        listItem.textContent = `姓名: ${node.name}, 角色ID: ${node.role_id}`;
        // 将列表项添加到无序列表中
        resultsList.appendChild(listItem);
    });

    // 将无序列表添加到搜索结果容器中
    searchResults.appendChild(resultsList);
});

// 获取所有可折叠元素
var coll = document.getElementsByClassName("collapsible");
// 为每个可折叠元素添加点击事件监听器
for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        // 在点击时切换活动类
        this.classList.toggle("active");
        // 获取当前可折叠元素的下一个兄弟元素（内容元素）
        var content = this.nextElementSibling;
        // 根据内容元素的当前显示状态，切换其显示或隐藏
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}